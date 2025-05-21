import { McpServer, StdioServerTransport } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import { getUpcomingEvents, scheduleEvent, CalendarEvent } from './dataSource.js'; // .js extension for ES modules

// 1. Initialize MCP Server
const server = new McpServer({
  name: "calendar-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {
      listChanged: false, // Not implementing dynamic list changes for now
      subscribe: false,   // Not implementing subscriptions for now
    },
    tools: {
      listChanged: false, // Not implementing dynamic list changes for now
    },
    // No prompts, logging, or completions for this version
  },
});

// 2. Expose "Upcoming Events" Resource
server.resource(
  "user-upcoming-events", // A unique name for this resource definition
  "Provides a list of upcoming events for a specific user, including their titles, start times, and end times.",
  z.object({ userId: z.string().describe("The ID of the user whose events to fetch") }),
  "user://{userId}/upcoming_events",
  async (params, exchange) => {
    const userId = params.userId;
    // console.error(`Fetching upcoming events for userId: ${userId}`); // For server-side logging
    const upcomingEvents: CalendarEvent[] = getUpcomingEvents(userId);
    // console.error(`Found events: ${JSON.stringify(upcomingEvents)}`);

    let contentText = `Upcoming Events for user ${userId}:\n`;
    if (upcomingEvents.length === 0) {
      contentText += "No upcoming events.\n";
    } else {
      upcomingEvents.forEach(event => {
        // Using toISOString() as per example, but more human-readable formats could be used
        contentText += `- ${event.title} (Starts: ${event.start.toLocaleString()}, Ends: ${event.end.toLocaleString()})\n`;
      });
    }
    return {
      contents: [{ type: "text", text: contentText }]
    };
  }
);

// 3. Expose "Schedule Event" Tool
const scheduleEventInputSchema = z.object({
  userId: z.string().describe("The ID of the user for whom to schedule the event"),
  title: z.string().describe("The title of the event"),
  startTime: z.string().datetime({ message: "Invalid datetime string. Must be in ISO 8601 format." }).describe("The start time of the event in ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ssZ)"),
  endTime: z.string().datetime({ message: "Invalid datetime string. Must be in ISO 8601 format." }).describe("The end time of the event in ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ssZ)"),
  description: z.string().optional().describe("Optional description for the event"),
  categoryId: z.string().optional().describe("Optional category ID for the event (e.g., 'work', 'personal')"),
  isRecurring: z.boolean().optional().default(false).describe("Optional flag indicating if the event is recurring, defaults to false"),
});

server.tool(
  "schedule_event",
  "Schedules a new calendar event for a specified user. Requires user ID, event title, and ISO 8601 start and end times. Optionally accepts description, category ID, and recurrence status.",
  scheduleEventInputSchema,
  async (args) => {
    // console.error(`Scheduling event with args: ${JSON.stringify(args)}`); // For server-side logging
    const newEvent = scheduleEvent(
      args.userId,
      args.title,
      args.startTime,
      args.endTime,
      args.description,
      args.categoryId,
      args.isRecurring
    );
    // console.error(`Scheduled event: ${JSON.stringify(newEvent)}`);

    return {
      content: [{
        type: "text",
        text: `Event '${newEvent.title}' has been successfully scheduled for user ${args.userId} from ${args.startTime} to ${args.endTime}. Event ID: ${newEvent.id}`
      }]
    };
  }
);

// 4. Start the Server
const transport = new StdioServerTransport();
server.connect(transport);

console.error("MCP Server for Calendar is running. Waiting for requests...");

// To run this server:
// 1. Ensure `mcp-server/src/dataSource.ts` and `mcp-server/src/index.ts` exist.
// 2. Ensure `mcp-server/tsconfig.json` is configured with "rootDir": "./src", "outDir": "./build".
// 3. Ensure `mcp-server/package.json` has "type": "module" and "main": "build/index.js".
//    And a build script: "build": "tsc".
// 4. Run `pnpm build` in `mcp-server` to compile TypeScript.
// 5. Run the server using a command that executes `build/index.js`, e.g., `node build/index.js`.
//    (Or, if the Model Context Protocol client expects to run the TS source directly with a loader,
//     that would be different, but typically compiled JS is run).
```
