# Project Tracking & Engineering Log – Hearth

This document tracks the engineering journey of the **Hearth** project from the initial template codebase to its current production-deployed state.

---

## 📈 Summary of Incorporated Features

1.  **Orchestrated Multi-Agent Reasoning Engine (ADK 2.0)**:
    *   Integrated Google's Agent Development Kit (`google-adk`).
    *   Exposes a pipeline with three specialized agents: Bouncer (Safety & Gatekeeper), Explorer (Conversational active listener), and Scribe (Summary writer).
2.  **Premium Glassmorphic React/Vite Interface**:
    *   Rebuilt the obsolete `static/` HTML/JS client into a production React app in `frontend/`.
    *   Features a dark emerald-black aesthetic (`#030806`) with jade green (`#10b981`) and amber-gold (`#fbbf24`) details.
3.  **List-Based Emotion Check-in (Emotion Wheel)**:
    *   Rebuilt the circular SVG wheel into a vertical multi-tier drill-down list (Core -> Secondary -> Tertiary).
    *   Acts as a breadcrumb navigation bar, allowing users to trace or reset selections.
4.  **Bonfire Loading Animation**:
    *   Designed a custom Vector-CSS flickering bonfire to display when the Scribe Agent compiles summaries.
5.  **Interactive Month/Year Journey Calendar Grid**:
    *   Built a monthly calendar tracker in React with navigation headers (`<<`, `<`, `>`, `>>`).
    *   Displays daily entries as dot indicators and exposes a side panel showing the detailed logs for selected dates.
6.  **Authentication Gateway**:
    *   Enforces an access gate.
    *   Provides standard email/password login/signup.
    *   Integrates a Google OAuth Identity Services (GIS) emulator with account-caching, allowing subsequent **1-click logins**.
    *   Provides a **Log In as Guest** button.
7.  **Model Context Protocol (MCP) Server**:
    *   Added a FastMCP server in `src/server/mcp_server.py` exposing journal search and retrieve tools to external LLM clients.
8.  **Responsive Mobile Optimization**:
    *   Replaced hardcoded inline layout rules with modular, media-queried CSS classes (`.calendar-layout-grid`, `.header-container`, `.recent-checkins-wrapper`, `.chat-layout-container`), optimizing margins, padding, column structures, and scroll wrappers for desktop and smartphone displays.

---

## ⚠️ Challenges, Issues, & Engineering Solutions

### 1. In-Memory Session History Loss in ADK Workflow
*   **Issue**: During multi-turn conversations, the Explorer Agent lost context and could not remember the previous turns, repeating questions.
*   **Root Cause**: The coordinator appended turns directly using `ctx.state['history'].append(...)`. Because lists are mutated in-place, the Pydantic change-detector inside the ADK workflow did not register a state change and failed to save/serialize the updated state to the backing store between steps.
*   **Solution**: Changed the list mutation to an explicit variable re-assignment to trigger Pydantic validation:
    ```python
    ctx.state['history'] = ctx.state['history'] + [new_message]
    ```

### 2. Leaking Safety Status & Duplicate Prompt Bubbles
*   **Issue**: When chatting with the Explorer Agent, intermediate events such as `"Valid"` from the Bouncer Agent or duplicated prompt chunks were printed inside the chat bubbles.
*   **Root Cause**: The server aggregated all text chunks (`event.content.parts`) emitted by the runner stream, which included status updates from intermediate workflow nodes.
*   **Solution**: Modified the events aggregator to filter out intermediate events and only return the final `event.output` populated exclusively when the coordinator node yields its final output.

### 3. Cloud Run Service Startup Crash (503 Service Unavailable)
*   **Issue**: The first Cloud Run deployment failed with a `Service unavailable` status page.
*   **Root Cause**: Google Cloud Logging revealed: `Default STARTUP TCP probe failed 1 time consecutively for container "hearth-app-1" on port 8080.` The Dockerfile CMD was hardcoded to run Uvicorn on port `8000`. Cloud Run expects the container to listen on the port supplied by the `$PORT` environment variable (defaulting to 8080).
*   **Solution**: Updated the root `Dockerfile` command to dynamically bind to the environment port:
    ```dockerfile
    CMD ["sh", "-c", "uvicorn src.server.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
    ```

### 4. Google Account Spoofing & Credential Leakage
*   **Issue**: In the initial Google Login popup simulation, clicking "Continue with Google" displayed a list of active Google accounts, allowing anyone to click the "Rakshith" account and log in without authentication.
*   **Root Cause**: The accounts were hardcoded into the picker dialog.
*   **Solution**: Built a secure multi-step Google Sign-In portal requiring Email, Password, and Permission Consent. Once authenticated, the account is cached in `localStorage` and added to the account picker list. This mirrors Google GIS OAuth, allowing subsequent **1-click passwordless logins** for that browser session, while protecting the account from external users.

### 5. Generic Tab Branding
*   **Issue**: The browser Chrome tab header read `"frontend"`.
*   **Root Cause**: The generic title `<title>frontend</title>` was left unchanged in `frontend/index.html`.
*   **Solution**: Replaced the title tag with `<title>Hearth</title>` and rebuilt/redeployed.

### 6. Mobile Layout Squishing & Overlap
*   **Issue**: On smartphone viewports, navigation headers overlapped, the 7-day check-in cards squeezed into unreadable ellipses, and the Journey Calendar split-pane layout became narrow and broken.
*   **Root Cause**: Core grids and headers were statically styled using inline declarations (e.g. `display: 'grid', gridTemplateColumns: '1.2fr 1fr'`) that ignored viewport dimension changes.
*   **Solution**: Refactored elements to use class selectors. Declared `@media (max-width: 768px)` rules to wrap headers into columns, stack calendar views vertically, limit chat height dynamically relative to virtual keyboards, and wrap check-in rows in a native touch-scrollable horizontal block.

### 7. Asynchronous Event Loop Thread Collisions (RuntimeError)
*   **Issue**: In the Cloud Run production environment, starting a new journal reflection crashed the backend, showing an empty chat screen and failing with `RuntimeError: Event loop is closed` in container logs.
*   **Root Cause**: The FastAPI server runs asynchronously. The backend called the synchronous `runner.run(...)` API, which spawns a background thread to manage thread-based asyncio loops. This background loop collided with FastAPI's main thread event loop, resulting in premature closure of connection pools when requests ended.
*   **Solution**: Refactored the FastAPI gateway to call `runner.run_async(...)` natively on the main event loop and consumed the generator stream using `async for event in events`.

### 8. Vertex AI Client 404 Errors (GCP Project ID resolving to None)
*   **Issue**: The Explorer Agent failed to respond to initial feelings, logging `google.genai.errors.ClientError: 404 Not Found`.
*   **Root Cause**: In Cloud Run's context, calling `google.auth.default()` returns credentials but leaves the project ID `None`. This caused the dynamic model path constructor to assemble an invalid resource identifier (`projects/None/locations/us-central1/...`), causing the SDK to throw a 404 on API requests. Furthermore, standard model calls fallback to AI Studio unless the full resource path starting with `projects/` is specified to force Vertex AI.
*   **Solution**: Added a robust project ID fallback check `project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")` (with zero hardcoded project IDs in the source code), and dynamically constructed a qualified Vertex AI path (`projects/{project_id}/locations/us-central1/publishers/google/models/gemini-2.5-flash`), resolving the 404.

### 9. Shared SQLite Database Table (Log Leakage)
*   **Issue**: Authenticators (Google accounts and Guest logins) were able to view each other's reflection logs and check-ins, posing a security/privacy gap.
*   **Root Cause**: The `journal_entries` table did not contain a `user_id` identifier. Query endpoints returned all table records globally.
*   **Solution**: Dropped and rebuilt the table with a `user_id TEXT` column. Configured `/api/entries` to query with a `WHERE user_id = ?` parameter. Passed the user identifier in both body payloads and headers from all React page components.

### 10. Monolithic Directory Pollution (Import Hacks)
*   **Issue**: Python imports inside the API gateway relied on dynamic path manipulation (`sys.path.append(...)`), which violates clean packaging standards.
*   **Root Cause**: The backend API server, database connection helper, and ADK reasoning engine were scattered across independent, disjoint root folders (`backend/`, `hearth-agent/`).
*   **Solution**: Consolidated all components into a unified, standard monorepo folder layout. Placed all code modules inside a central `src/` directory containing dedicated sub-packages for `src/database`, `src/server`, and `src/agent`. Bridge wrappers and duplicate dependencies were removed completely, unifying configs under `pyproject.toml` and `agents-cli-manifest.yaml` at the root.
