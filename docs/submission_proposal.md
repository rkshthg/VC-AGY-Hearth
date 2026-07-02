# Submission Proposal: Hearth (Concierge Agents Track)

## 1. Central Idea: Hearth – The Emotional Wellness Concierge
**Hearth** is an AI-powered emotional wellness concierge designed to streamline, guide, and simplify daily self-reflection and mental well-being. Modern lives are filled with cognitive overload, leaving individuals with little time to process complex emotions or journal constructively. 

Hearth acts as a safe, warm sanctuary where users check in by navigating a three-tiered list of emotions (from core feelings like *Bad* to secondary feelings like *Stressed* down to tertiary feelings like *Overwhelmed*). Once logged, a **multi-agent orchestration workflow** takes over:
*   An **Explorer Agent** engages the user through active listening, posing short, exploratory, non-suggestive questions to help them unpack their day within a structured 10-turn cap.
*   A **Scribe Agent** synthesizes the dialog into a highly detailed first-person summary, capturing situations, events, and names.
*   A **Bouncer Agent** stands guard at the door, filtering off-topic discussions and blocking prompt injections.
*   The **Workflow Coordinator** ensures that the synthesized journal entry is never stored until the user reviews, edits, and explicitly approves the draft.

---

## 2. Relevance to the Concierge Agents Track
The **Concierge Agents** track highlights the potential of AI to simplify personal lives while keeping sensitive information secure. Hearth is directly relevant to this track in the following ways:

*   **Solving an Individual Challenge**: Emotional regulation and processing stress is a major individual hurdle. Hearth acts as an emotional concierge—removing the "blank page syndrome" of traditional journaling by guiding the conversation, synthesizing thoughts, and managing a structured emotional archive.
*   **Privacy & Security at the Center**: Journaling contains highly sensitive personal data. Hearth secures this information through architectural design:
    *   **Bouncer Input Guardrail**: A dedicated agent inspects all turns, blocking prompt-injection attempts and off-topic topics.
    *   **User-in-the-Loop Consent**: The agent cannot write to the database independently. The user has absolute editing rights over the generated summary, approving it before it is saved.
    *   **User-Level Log Isolation**: Database queries and routes are strictly filtered by the authenticated user's ID/email. Users can only access their own private reflections; switching accounts or logging in as guest immediately isolates data view.
    *   **Secure Infrastructure**: Deployed on Google Vertex AI Agent Runtime, keeping reasoning paths and model interaction completely private and isolated.

---

## 3. Innovation
*   **Specialized Multi-Agent Orchestration**: Rather than using a single, generic chatbot, Hearth deploys a workflow of three specialized agents (Bouncer, Explorer, Scribe) controlled by a central Coordinator. Each agent has strict behavioral constraints (e.g., the Explorer cannot suggest actions; the Scribe is strictly capped at 500 words and must write in the first-person).
*   **Rerun-on-Resume State Management**: Hearth implements Vertex AI ADK's `FunctionNode` with state persistence. It stores conversational history securely and handles user pauses, resumptions, and approvals natively.
*   **Symphonic Frontend Integration**: Swaps standard loading screens for a custom bonfire Vector-CSS animation, indicating to the user that the Scribe is active, and provides a monthly calendar grid showing past emotional patterns at a glance.

---

## 4. Value
*   **Mental Clarity & Reduced Friction**: Hearth lowers the barrier to mental wellness by turning reflection into a natural conversation, completing a meaningful journal entry in under 5 minutes.
*   **Deep Self-Discovery**: The monthly calendar details drawer lets users identify triggers, recurring stressors, and positive patterns by viewing emotional paths over months and years.
*   **Safe Personal Archive**: Provides a secure emotional timeline that the user owns, helping them reclaim time for what matters by organizing their inner landscape.
