# Hearth Video Presentation Script (5-Minute Limit)

**Total Estimated Duration**: ~4 minutes, 45 seconds (approx. 650 words spoken at 140 WPM).

---

## 🎬 Section 1: Intro & Problem Statement (0:00 - 0:45)
*   **On-Screen**: Close-up of speaker, transitioning to a split screen showing a person looking stressed at a desktop, next to a smartphone showing a blank notes application with a blinking cursor.
*   **Speaker Voiceover**: 
    > "We live in an era of constant cognitive overload. Between work, family, and digital noise, our minds accumulate mental clutter. Daily self-reflection and journaling are proven ways to decompress, but they suffer from what we call the 'blank page syndrome.' 
    > 
    > When you sit down to write about your day, you often don't know where to start, or you get bogged down in details. Traditional journals are passive; they don't listen, they don't guide, and they don't help you organize your inner landscape in a safe, structured way. That is the problem we set out to solve with **Hearth**."

---

## 🤖 Section 2: Why Agents? (0:45 - 1:30)
*   **On-Screen**: Diagram showing a single LLM chat interface contrasted with a coordinated multi-agent team. Highlight the words: *Active Listening*, *Firewall*, and *Synthesis*.
*   **Speaker Voiceover**:
    > "So why use AI agents instead of a standard chatbot? A general LLM chat can easily wander off-topic, give unsolicited advice, or store rambling, unstructured logs. 
    > 
    > Hearth uses a **Multi-Agent System** because reflection requires specialized roles:
    > *   First, we need an **Explorer** that does not give advice, but practices active listening—posing short, reflective questions to guide you.
    > *   Second, we need a **Scribe** to digest the raw dialog and convert it into a structured, first-person journal entry.
    > *   And third, we need a **Bouncer** to act as a security firewall, keeping the conversation safe, secure, and focused on wellness. 
    > 
    > Only an agent-based architecture can enforce these strict behavioral boundaries natively."

---

## 🏛️ Section 3: Architecture Overview (1:30 - 2:15)
*   **On-Screen**: Renders the Hearth multi-agent coordinator workflow diagram.
    *   *Show node connections*: User Input $\rightarrow$ Coordinator $\rightarrow$ Bouncer $\rightarrow$ Explorer / Scribe $\rightarrow$ Database.
*   **Speaker Voiceover**:
    > "Here is how the architecture works under the hood. 
    > 
    > Hearth is built on top of **Google's Agent Development Kit (ADK 2.0)**. A central **Workflow Coordinator** manages the session state, ensuring conversation history is preserved across turns. 
    > 
    > Every message you send is first analyzed by the **Bouncer Agent** for safety. If it passes, the Coordinator routes the turn to the **Explorer Agent** to continue the reflection session. 
    > 
    > When the session wraps up, the Coordinator hands the history to the **Scribe Agent** to compile a reflection draft. Crucially, we implement a **User-in-the-Loop Consent Gate**: the draft is displayed to you for editing, and is only written to the secure SQLite database (isolated for your account only) once you click 'Approve & Save'."

---

## 📱 Section 4: Live Demo (2:15 - 3:45)
*   **On-Screen**: Screen recording of the Hearth app loading.
    1.  *Show Google 1-click login popup picker.*
    2.  *Show the vertical emotion selector check-in (clicking Bad -> Stressed -> Overwhelmed).*
    3.  *Show a quick chat turn with the Explorer.*
    4.  *Highlight the custom CSS bonfire loading animation.*
    5.  *Show the Scribe modal popping up with the summary draft, editing a line, and saving.*
    6.  *Show the Journey Calendar grid, page through months, click a date, and view the side panel.*
*   **Speaker Voiceover**:
    > "Let's see Hearth in action. We'll start on our secure login portal. Hearth supports standard credentials, but it also features a simulated Google OAuth account picker. Since I've signed in before, I can log in with a single click.
    > 
    > Now, let's log a new session. We start with our drill-down emotion list. I select 'Bad', then 'Stressed', and finally 'Overwhelmed'. 
    > 
    > The Explorer Agent takes over. Notice how short and guiding its response is. As we chat, our custom bonfire loading indicator flickers on screen, showing the agent is thinking.
    > 
    > I'll click 'Wrap Up'. The Scribe summarizes our conversation. I can review this draft, tweak the text in the modal, and hit approve.
    > 
    > Finally, we navigate to the Journey Calendar. It highlights my past logs. I can page back through months and years. Clicking a date displays my logs for that day, showing my emotional patterns over time. Notice that if I log out and log in as Guest, my calendar is empty—Hearth strictly isolates journal logs by user ID to guarantee complete privacy."

---

## 🛠️ Section 5: The Build & Technologies (3:45 - 4:45)
*   **On-Screen**: Code snippets showing the ADK workflow nodes, the FastMCP server code, and the Dockerfile.
*   **Speaker Voiceover**:
    > "To build Hearth, we utilized the **Agents CLI** toolchain to package and test the ADK code before deploying it to **Vertex AI Agent Runtime** as a Reasoning Engine. 
    > 
    > The frontend is built with React and TypeScript, served by a FastAPI backend. We compiled the entire stack into a Docker container and deployed it publicly to **Google Cloud Run** with dynamic port bindings. 
    > 
    > We also integrated the **Model Context Protocol**. Hearth runs a local **FastMCP server**, exposing tools so that external assistant agents can securely search and retrieve journal summaries from our database, with queries safely filtered by user ID to maintain isolation."

---

## 👋 Section 6: Outro (4:45 - 5:00)
*   **On-Screen**: Close-up of speaker, displaying the URL: `hearth-app-613449614619.us-east1.run.app`.
*   **Speaker Voiceover**:
    > "Hearth is more than a journal; it is a safe emotional wellness concierge that helps you clear your mind and track your journey. Try it out live at the link below. Thank you!"
