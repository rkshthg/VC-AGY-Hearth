import os
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Clean absolute package imports – no sys.path hacks
from src.agent.workflows import root_agent
from src.database.db import get_db_connection, init_db
from src.utils.encryption import decrypt_text

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.genai import types

app = FastAPI(title="Hearth Production Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup global ADK runner
session_service = InMemorySessionService()
runner = Runner(agent=root_agent, session_service=session_service, app_name="hearth")

# Database initialization - clear table and recreate with user_id to start afresh
init_db(drop_tables=True)

# Request schemas for chat endpoints and database actions
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = "guest"

class SaveEntryRequest(BaseModel):
    summary: str
    emotion_path: str
    user_id: str

@app.get("/api/entries")
async def get_entries(user_id: str = "guest"):
    """Fetches user-specific past journal entries from SQLite for the Journey Calendar grid."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, date, emotion_path, summary FROM journal_entries WHERE user_id = ? ORDER BY date DESC", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        entries = []
        for r in rows:
            raw_date = r['date']
            # Format TIMESTAMP date from 'YYYY-MM-DD HH:MM:SS' to 'YYYY-MM-DD'
            date_only = raw_date.split(' ')[0] if ' ' in raw_date else raw_date
            
            path = r['emotion_path']
            # Extract first segment of emotion path as the primary emotion classification
            primary = path.split('->')[0].strip() if '->' in path else path.strip()
            
            entries.append({
                "id": r['id'],
                "date": date_only,
                "emotion_path": path,
                "primaryEmotion": primary,
                "summary": decrypt_text(r['summary'])
            })
        return entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    """Bridges client chat inputs to the Vertex AI ADK Multi-Agent Workflow Runner.
    
    Design Behavior:
    - Creates or retrieves active session IDs.
    - Exposes state properties (turn count, pending approval, emotion paths).
    - Ignores intermediate safety logging steps, yielding only final runner event outputs.
    """
    try:
        session_id = req.session_id
        user_id = req.user_id or "guest"
        if not session_id:
            session = session_service.create_session_sync(user_id=user_id, app_name="hearth")
            session_id = session.id
        else:
            session = session_service.get_session_sync(app_name="hearth", user_id=user_id, session_id=session_id)
            if not session:
                session = session_service.create_session_sync(user_id=user_id, app_name="hearth", session_id=session_id)
        
        message = types.Content(
            role="user", parts=[types.Part.from_text(text=req.message)]
        )
        events = runner.run_async(
            new_message=message,
            user_id=user_id,
            session_id=session_id,
            run_config=RunConfig(streaming_mode=StreamingMode.SSE),
        )
        
        # Event output filter: only extract the final output of the Workflow Coordinator
        output_text = ""
        async for event in events:
            if hasattr(event, 'output') and event.output:
                output_text = event.output
        
        # Reload state mapping to read turn counts and approval status
        updated_session = session_service.get_session_sync(app_name="hearth", user_id=user_id, session_id=session_id)
        state = updated_session.state if updated_session else {}
        
        return {
            "response": output_text,
            "session_id": session_id,
            "turn_count": state.get("turn_count", 0),
            "emotion_path": state.get("emotion_path", []),
            "summary": state.get("summary", ""),
            "pending_approval": state.get("pending_approval", False)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save_entry")
async def save_entry(req: SaveEntryRequest):
    """Direct database commit endpoint for user-approved Scribe reflection summaries."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO journal_entries (emotion_path, summary, user_id) VALUES (?, ?, ?)",
            (req.emotion_path, req.summary, req.user_id)
        )
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Journal entry successfully saved to database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve compiled React frontend assets directly from production build directory
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/dist'))
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{rest_of_path:path}")
    async def serve_frontend(rest_of_path: str):
        # Exclude internal API requests from falling back to front-end router
        if rest_of_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        return FileResponse(os.path.join(dist_dir, 'index.html'))
else:
    @app.get("/")
    async def fallback_root():
        return {"status": "running", "message": "Backend server is running. Front-end dist folder not found."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
