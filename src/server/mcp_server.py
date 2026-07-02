from mcp.server.fastmcp import FastMCP
import sqlite3
import os

from src.database.db import get_db_connection

# Create a FastMCP server named "Hearth Journal" for external agent integration
mcp = FastMCP("Hearth Journal")

@mcp.tool()
def get_latest_journal_entries(user_id: str = "guest", limit: int = 5) -> str:
    """Retrieve the latest emotional journal summaries from Hearth for a specific user.
    
    Design Behavior:
    - Queries the database for the most recent journal reflection entries matching user_id.
    - Dynamically parses the primary emotion classification from the stored emotion path.
    
    Args:
        user_id (str): The identifier of the user (default: 'guest').
        limit (int): The maximum number of entries to return (default: 5).
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Query only existing table columns to avoid OperationalErrors
        cursor.execute("SELECT date, emotion_path, summary FROM journal_entries WHERE user_id = ? ORDER BY id DESC LIMIT ?", (user_id, limit))
        rows = cursor.fetchall()
        conn.close()
        
        if not rows:
            return f"No journal entries found in Hearth for user '{user_id}'."
            
        result = []
        for i, row in enumerate(rows, 1):
            date, path, summary = row['date'], row['emotion_path'], row['summary']
            # Dynamically compute primary emotion from path
            primary = path.split('->')[0].strip() if '->' in path else path.strip()
            result.append(
                f"Entry #{i}\n"
                f"Date: {date}\n"
                f"Emotion Path: {path}\n"
                f"Primary Emotion: {primary}\n"
                f"Summary: {summary}\n"
                f"----------------------------------------"
            )
        return "\n".join(result)
    except Exception as e:
        return f"Error reading journal entries: {str(e)}"

@mcp.tool()
def search_entries_by_emotion(emotion: str, user_id: str = "guest") -> str:
    """Search for past journal entries matching a specific primary emotion for a specific user.
    
    Design Behavior:
    - Scans journal entries matching user_id and filters them by mapping the input emotion keyword.
    
    Args:
        emotion (str): The primary emotion to search for (e.g., 'Happy', 'Sad', 'Bad').
        user_id (str): The identifier of the user (default: 'guest').
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT date, emotion_path, summary FROM journal_entries WHERE user_id = ? ORDER BY id DESC", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        if not rows:
            return f"No journal entries found in Hearth for user '{user_id}'."
            
        result = []
        match_idx = 1
        for row in rows:
            date, path, summary = row['date'], row['emotion_path'], row['summary']
            primary = path.split('->')[0].strip() if '->' in path else path.strip()
            
            # Perform case-insensitive matching against primary emotion or path
            if emotion.lower() in primary.lower() or emotion.lower() in path.lower():
                result.append(
                    f"Result #{match_idx}\n"
                    f"Date: {date}\n"
                    f"Emotion Path: {path}\n"
                    f"Primary Emotion: {primary}\n"
                    f"Summary: {summary}\n"
                    f"----------------------------------------"
                )
                match_idx += 1
                
        if not result:
            return f"No entries found matching emotion: '{emotion}' for user '{user_id}'"
            
        return "\n".join(result)
    except Exception as e:
        return f"Error searching journal entries: {str(e)}"

if __name__ == "__main__":
    mcp.run()
