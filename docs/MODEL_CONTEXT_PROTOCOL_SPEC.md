# Model Context Protocol - API Specification (Draft V1)

This document provides the initial specification for the Model Context Protocol, which will be implemented as a server-side API endpoint to provide contextual information to the AI assistant.

## 1. Overview

*   **Purpose:** To supply the AI chat assistant with relevant, up-to-date information about the user's schedule, activities, and potentially preferences, enabling more intelligent and personalized interactions.
*   **Method:** A RESTful API endpoint within the Next.js application.
*   **Chosen Model:** Llama 3 8B (via Groq SDK) is the primary target for consuming this context, but the format should be general enough for other models.

## 2. API Endpoint Details

*   **Endpoint:** `GET /api/ai/context`
*   **Authentication:** This endpoint must be protected and should only be accessible by authenticated users. It will leverage the existing authentication mechanism of the Next.js application (e.g., session cookies, JWT tokens). The backend logic for the AI chat will make authenticated requests to this endpoint.
*   **Request Method:** `GET`

## 3. Request Parameters

No specific request parameters are defined for V1, as the endpoint will return a general context bundle for the authenticated user. Future versions might allow specifying the type of context needed (e.g., `?type=upcoming_events`).

## 4. Response Format

The API will return a JSON object.

### 4.1. Top-Level Structure

```json
{
  "timestamp": "2024-07-30T10:00:00Z", // ISO 8601 UTC timestamp of when the context was generated
  "user": {
    "timezone": "America/New_York" // User's timezone (important for date/time interpretation)
    // Future: user_id, preferences, etc.
  },
  "calendar": {
    "today": [], // Array of Activity Objects for today
    "upcoming": [], // Array of Activity Objects for the next N days (e.g., 7 days)
    "recent": [] // Array of Activity Objects recently completed (e.g., last 3)
    // Future: free_slots, recurring_patterns, etc.
  },
  "chat_summary": { // Optional: If we implement chat history summarization
    "last_interaction_type": "schedule_request",
    "key_topics": ["project deadline", "team meeting"]
  }
  // Future: other context domains like tasks, goals, etc.
}
```

### 4.2. Activity Object Structure

The `Activity Object` will mirror the structure defined in `types/activity.ts`, but potentially simplified for AI consumption.

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "start": "ISO 8601 DateTimeString", // e.g., "2024-07-30T14:00:00Z"
  "end": "ISO 8601 DateTimeString",   // e.g., "2024-07-30T15:00:00Z"
  "categoryId": "string | null", // e.g., "work", "personal"
  "isRecurring": "boolean"
  // We might omit fields like 'originalId' or complex 'recurrenceRule' objects for the AI context,
  // unless the AI is specifically tasked with understanding recurrence patterns.
}
```

## 5. Data Sources

*   **User's Activities:** Fetched from the application's data store (e.g., Supabase, or current `sampleActivities.ts` for development).
*   **User's Timezone:** Should be determined from user settings or browser. Default to a common timezone if not available.
*   **Chat Summary:** (Future) Would require storing and processing chat history.

## 6. How the AI Will Use This Context

The backend of the `ai-chat.tsx` component (or a server function it calls) will:
1.  Call the `/api/ai/context` endpoint.
2.  Receive the JSON context bundle.
3.  Format this context into a system message or a preamble that is included in the prompt sent to the Groq API.
    *   Example Preamble: "You are a scheduling assistant. Here is the current context: Today's events are [...]. Upcoming events are [...]. The user's timezone is [...]."

## 7. Future Considerations

*   **Context Granularity:** Allow requesting specific parts of the context.
*   **Real-time Updates:** For more dynamic scenarios, explore WebSockets (see `MODEL_CONTEXT_PROTOCOL_IDEAS.md`).
*   **Context from other sources:** Integrate tasks, notes, or other relevant user data.
*   **AI-driven context fetching:** Allow the AI to request specific information if not present in the initial bundle (would require a more complex interaction model).

This specification provides a starting point. The actual fields and data structures will be refined during implementation.
```
