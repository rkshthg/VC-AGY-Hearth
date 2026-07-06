# Hearth - Emotional Wellness Sanctuary

![Hearth App Demo](docs/gallery/hearth_full_demo_v2.webp)

## 😟 The Problem

In today's fast-paced digital world, people often struggle to find a private, secure, and guided space to process their emotions. Traditional journaling can feel overwhelming, unstructured, or time-consuming, making it difficult to maintain a consistent habit of emotional reflection and identify long-term emotional patterns.

## 💡 The Solution

Hearth is a safe, premium, glassmorphic journal and emotional tracking application powered by a multi-agent workflow. It acts as an intelligent companion that guides users through mindful reflection, starting with a structured emotion drill-down. It processes your feelings, helps you draft thoughtful summaries of your day, and stores a private, structured journal archive. Finally, it visualizes your emotional journey over time through an interactive calendar.

---

## 🏗️ Architecture

Hearth is built using a modern, decoupled architecture leveraging AI orchestration:

### Frontend (User Interface)
*   **React 18** (TypeScript, Vite build toolchain)
*   **Vanilla CSS** (Custom CSS variables, bonfire loading keyframes, glassmorphism card styling)
*   **Lucide React** (Vector icons)

### Backend (API Gateway & Persistence)
*   **FastAPI** (Python 3.11 framework, asynchronous endpoints, static assets mounting)
*   **Uvicorn** (ASGI server)
*   **SQLite** (Local secure relational storage `journal.db`)

### AI Runtimes & Orchestration
*   **Google ADK (ADK 2.0 / `google-adk`)**: Workflow orchestrator for reasoning engines.
*   **Vertex AI Agent Runtime**: Native cloud execution hosting the agent engine.
*   **Model Context Protocol (FastMCP / `mcp`)**: Secure server exposing tools for external assistant agents to query journal histories.

---

## 🚀 Prerequisites

Before starting, ensure you have the following installed on your machine:

1.  **Python 3.11+**
2.  **Node.js (v18 or higher)** and `npm`
3.  **Google Cloud CLI (gcloud)**
    *   Authenticate with Google Cloud:
        ```bash
        gcloud auth login
        gcloud auth application-default login
        ```
    *   Set your active project:
        ```bash
        gcloud config set project <YOUR_GCP_PROJECT_ID>
        ```

---

## 💻 Local Setup & Deployment

Follow these steps to run the frontend and backend locally:

### 1. Configure the Python Virtual Environment
1.  In the root directory of the project, create and activate a virtual environment:
    ```bash
    # Windows:
    python -m venv .venv
    .venv\Scripts\activate
    
    # macOS/Linux:
    python3 -m venv .venv
    source .venv/bin/activate
    ```
2.  Install the unified application package and its dependencies in editable mode:
    ```bash
    pip install -e .
    ```

### 2. Build the Frontend
1.  Navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install npm dependencies:
    ```bash
    npm install
    ```
3.  Compile the React production build:
    ```bash
    npm run build
    ```
    This outputs the compiled assets to `frontend/dist/`, which will be served directly by the FastAPI backend.
4.  Navigate back to the root directory:
    ```bash
    cd ..
    ```

### 3. Start the Backend Server
1.  Ensure your root `.venv` is activated.
2.  Define the required environment variables:
    *   Set `GOOGLE_CLOUD_PROJECT` to your active GCP project.
    *   Set `AGENT_RUNTIME_ID` to your deployed Reasoning Engine ID.
3.  Start the FastAPI uvicorn server directly using python's module executor:
    ```bash
    python -m uvicorn src.server.main:app --host 0.0.0.0 --port 8000
    ```
4.  Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🔌 Running the MCP Server Locally

Hearth has a built-in Model Context Protocol server that external LLM interfaces (like Claude Desktop or Gemini) can use to read your journal data.

1.  To start the MCP server using Standard I/O transport:
    ```bash
    python -m src.server.mcp_server
    ```
2.  You can inspect and debug the server using the MCP inspector:
    ```bash
    npx @modelcontextprotocol/inspector python -m src.server.mcp_server
    ```
