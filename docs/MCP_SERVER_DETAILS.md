# MCP Server Details

This document describes the Model Context Protocol (MCP) server implemented in this project.

## 1. Overview

*   **Location:** The server code is located in the `mcp-server/` directory.
*   **Technology:** It is a Node.js application written in TypeScript, utilizing the official `@modelcontextprotocol/sdk`.
*   **Purpose:** To expose user calendar data and scheduling capabilities according to the MCP standard.
*   **Data Store:** Currently uses an in-memory data store (`mcp-server/src/dataSource.ts`) populated with sample data for demonstration.

## 2. Transport

*   The server uses `StdioServerTransport` for communication, meaning it interacts with an MCP client via standard input/output.

## 3. How to Build & Run

1.  **Navigate to the server directory:**
    ```bash
    cd mcp-server
    ```
2.  **Install dependencies** (if you haven't already):
    ```bash
    pnpm install
    ```
3.  **Build the server** (compile TypeScript to JavaScript):
    ```bash
    pnpm run build
    ```
    This will create a `build/` directory with the compiled code.
4.  **Run the server:**
    ```bash
    node build/index.js
    ```
    The server will then be active and waiting for an MCP client to connect via stdio.

## 4. Exposed Capabilities

The server exposes the following capabilities as defined in `mcp-server/src/index.ts`:

### 4.1. Resource: Upcoming Events

*   **Internal Name:** `user-upcoming-events` (used in server logs/debug)
*   **URI Template:** `user://{userId}/upcoming_events`
*   **Description:** "Provides a list of upcoming events for a specific user, including their titles, start times, and end times."
*   **Parameters:**
    *   `userId` (string): The ID of the user whose events are to be fetched. This is part of the URI.
*   **Output:** A textual list of upcoming events for the specified user. Example:
    ```
    Upcoming Events for user user1:
    - Team Meeting (User 1) (Starts: 5/21/2025, 7:02:31 PM, Ends: 5/21/2025, 8:02:31 PM)
    - Project Deadline (User 1) (Starts: 5/24/2025, 5:02:31 PM, Ends: 5/24/2025, 6:02:31 PM)
    ```
    If no events are found, it returns "No upcoming events."

### 4.2. Tool: Schedule Event

*   **Name:** `schedule_event`
*   **Description:** "Schedules a new calendar event for a specified user. Requires user ID, event title, and ISO 8601 start and end times. Optionally accepts description, category ID, and recurrence status."
*   **Input Schema (defined using Zod):**
    *   `userId` (string): The ID of the user for whom to schedule the event.
    *   `title` (string): The title of the event.
    *   `startTime` (string, ISO 8601 datetime): The start time of the event (e.g., "YYYY-MM-DDTHH:mm:ssZ").
    *   `endTime` (string, ISO 8601 datetime): The end time of the event (e.g., "YYYY-MM-DDTHH:mm:ssZ").
    *   `description` (string, optional): Optional description for the event.
    *   `categoryId` (string, optional): Optional category ID for the event (e.g., 'work', 'personal').
    *   `isRecurring` (boolean, optional, default: `false`): Optional flag indicating if the event is recurring.
*   **Output:** A textual confirmation of the event creation. Example:
    ```
    Event 'Doctor Visit' has been successfully scheduled for user user1 from 2025-05-30T10:00:00.000Z to 2025-05-30T11:00:00.000Z. Event ID: <uuid_here>
    ```

## 5. Integration with MCP Clients

This server can be integrated with MCP clients (such as a local LLM client or Claude Desktop, if it supports MCP). The client would need to be configured to execute the run command: `node /path/to/your/project/mcp-server/build/index.js`. The exact path will depend on where your project is cloned.

## Manual Testing with MCP Inspector

You can test this MCP server using the official `@modelcontextprotocol/inspector` tool. This tool allows you to connect to MCP servers running over stdio and interact with their exposed resources and tools.

**Prerequisites:**
*   Ensure the MCP server is built:
    ```bash
    cd mcp-server
    pnpm run build
    ```
*   You need `npx` (which comes with Node.js/npm).

**Running the Inspector:**

1.  From the **project root directory** (not inside `mcp-server`), run the following command:
    ```bash
    npx -y @modelcontextprotocol/inspector node mcp-server/build/index.js
    ```
    This command tells `npx` to download and run the inspector, and the inspector, in turn, will execute your MCP server script (`node mcp-server/build/index.js`).

2.  The MCP Inspector should launch (it's a terminal-based UI).

**Interacting with the Server via Inspector:**

*   **Resources:**
    *   Navigate to the "Resources" tab in the Inspector.
    *   You should see the `user-upcoming-events` resource listed.
    *   To test it, you'll need to provide the `userId` parameter. For example, if you used "user1" in your sample data:
        *   In the URI input field, type: `user://user1/upcoming_events`
        *   Press Enter or click the "Read" button.
        *   The Inspector should display the textual list of upcoming events for "user1".
        *   Try with other user IDs you might have in your sample data, or a non-existent one to see how it behaves.

*   **Tools:**
    *   Navigate to the "Tools" tab in the Inspector.
    *   You should see the `schedule_event` tool listed.
    *   Select it, and the Inspector will show the input schema.
    *   Fill in the arguments:
        *   `userId`: e.g., "user1"
        *   `title`: e.g., "Test Event via Inspector"
        *   `startTime`: e.g., (a future ISO 8601 date like `2024-12-01T10:00:00Z`)
        *   `endTime`: e.g., (a future ISO 8601 date like `2024-12-01T11:00:00Z`)
        *   `description` (optional): e.g., "Testing MCP tool"
    *   Click the "Call" button.
    *   The Inspector should display the confirmation message from the tool.
    *   You can then re-read the `user://user1/upcoming_events` resource to see if your new event appears in the list.

This provides a way to manually verify that the server's resource and tool are functioning as expected.
```
