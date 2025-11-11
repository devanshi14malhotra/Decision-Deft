## Decision Deft: Your AI Decision Helper

Decision Deft is a sleek, conversational AI chatbot designed to help you navigate life's daily dilemmas. Powered by the Google Gemini API, it acts as a co-pilot for your choices, asking clarifying questions, generating pros and cons, and providing psychological insights to help you make decisions with confidence.

## Core Features

-   **Conversational Decision Flow**: Engage in a natural conversation with an AI that understands your situation, priorities, and constraints.
-   **One-Click Pros & Cons**: Instantly generate a balanced, Markdown-formatted list of pros and cons based on your conversation with a single click.
-   **Regret Score Analysis**: Get a psychological analysis of your decision's potential for regret, complete with a "Regret Management Plan" offering actionable advice to mitigate post-decision anxiety.
-   **Quick Save & Export**: Easily save your decision logs. Export any conversation as a `.md` (Markdown) file to review your thought process later.
-   **Anonymous Mode**: Toggle "Private Mode" to have a conversation without it being saved to your device's local storage, ensuring complete privacy for sensitive dilemmas.
-   **Modern, Responsive UI**: A beautiful, "glassmorphism" inspired interface that is a pleasure to use on any device.

## How It Works

1.  **Start a Decision**: Click "Start a New Decision" to begin a new chat session.
2.  **Describe Your Dilemma**: Talk to the bot as you would a friend. Explain the choice you're facing. The first message you send will automatically become the title of the conversation.
3.  **Use Analysis Tools**:
    -   Click the **Balance Icon** to get a detailed list of pros and cons.
    -   Click the **Regret Icon** to receive a psychological analysis and regret management plan.
4.  **Manage & Review**:
    -   Your conversations are automatically saved to your browser's local storage.
    -   Select any past conversation from the sidebar to review or continue it.
    -   Use the **Download Icon** to export your chat history as a Markdown file.
    -   Toggle **Private Mode** on for conversations you don't want to be saved.


## Run Locally

**Prerequisites:**  Node.js
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
