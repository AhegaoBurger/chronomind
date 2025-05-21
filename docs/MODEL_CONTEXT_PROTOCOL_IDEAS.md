# Model Context Protocol - Brainstorming & Ideas

This document outlines potential ideas for implementing a "Model Context Protocol" to provide the AI chat assistant with better understanding and context about the user's activities, preferences, and overall schedule.

## Goal

The primary goal is to enable the AI to offer more relevant, personalized, and proactive assistance by having access to necessary contextual information.

## Ideas Considered

### 1. Simple API Endpoint (Next.js API Route)

*   **Description:** Create a dedicated API route within the Next.js application (e.g., `/api/ai/context`). The AI chat backend (in `ai-chat.tsx` or a server-side component it calls) would query this endpoint to fetch context before generating a response or when specific contextual information is needed.
*   **Data Provided:**
    *   Current date and time.
    *   List of today's scheduled activities.
    *   List of upcoming activities (e.g., next 3-5 events in the next 7 days).
    *   Recently completed activities.
    *   Number of free slots on specific days or general availability patterns (e.g., "User seems to be busy on weekday mornings").
    *   User preferences (if stored, e.g., preferred work hours, preferred activity types).
    *   Summary of recent interactions or tasks delegated to the AI (if chat history is stored and analyzed).
*   **Pros:**
    *   Relatively straightforward to implement within the existing Next.js architecture.
    *   Leverages existing authentication if the API route is secured.
    *   Stateless from the perspective of the context provider (each call fetches current info).
*   **Cons:**
    *   Context is only as fresh as the last call; not real-time.
    *   Might require careful structuring of the data to be easily consumable by the AI prompt.

### 2. WebSocket for Real-time Context Pushing

*   **Description:** Implement a WebSocket server. The AI assistant's backend would maintain a connection. When relevant data changes (e.g., a new event is added to the calendar, a task is completed), the server pushes updated context to the AI backend.
*   **Data Provided:** Similar to the API endpoint, but updates can be granular and pushed in real-time.
*   **Pros:**
    *   AI always has the latest context.
    *   Can enable more proactive AI behaviors based on immediate changes.
*   **Cons:**
    *   More complex to implement and manage (WebSocket connections, stateful server component).
    *   Scalability considerations might be more significant.
    *   Potentially overkill for the current needs.

### 3. Client-Side Context Aggregation & Injection

*   **Description:** The `ai-chat.tsx` component itself (or a client-side service it uses) gathers context directly from other components or client-side data stores (e.g., the `activities` prop it already receives, or a shared Zustand/Redux store if one were introduced). This context would then be formatted and included in the prompt sent to the Groq API.
*   **Data Provided:** Primarily limited to what's already available on the client or easily fetchable by the client.
*   **Pros:**
    *   Simpler for accessing data already present on the client.
    *   No separate server-side context endpoint needed initially.
*   **Cons:**
    *   Context might be incomplete if not all relevant data is on the client.
    *   Can make the client-side AI logic more complex.
    *   Security: Care must be taken not to expose sensitive data directly in client-side code that forms the prompt if the context isn't already part of the UI's data.
    *   Less scalable if context needs server-side processing or aggregation from multiple sources (like a database).

## Selected Idea for Initial Specification

For the initial specification, we will proceed with **Idea 1: Simple API Endpoint (Next.js API Route)**.

*   **Reasoning:** It strikes the best balance between utility and implementation complexity for the current stage of the project. It allows for significant contextual enhancement for the AI without requiring a major architectural overhaul. The data it can provide will already be a substantial improvement for the AI's capabilities.
