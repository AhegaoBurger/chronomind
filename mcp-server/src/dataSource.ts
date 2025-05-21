import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  start: Date;
  end: Date;
  isRecurring?: boolean;
  categoryId?: string | null;
}

let events: CalendarEvent[] = [];

// --- Data Access Functions ---

/**
 * Retrieves upcoming events for a specific user, sorted by start time.
 * @param userId The ID of the user whose events are to be retrieved.
 * @returns An array of upcoming CalendarEvent objects.
 */
export function getUpcomingEvents(userId: string): CalendarEvent[] {
  const now = new Date();
  return events
    .filter(event => event.userId === userId && event.start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Schedules a new event for a specific user.
 * @param userId The ID of the user for whom the event is scheduled.
 * @param title The title of the event.
 * @param startTimeIso ISO string representation of the event start time.
 * @param endTimeIso ISO string representation of the event end time.
 * @param description Optional description of the event.
 * @param categoryId Optional category ID for the event.
 * @param isRecurring Optional flag indicating if the event is recurring.
 * @returns The newly created CalendarEvent object.
 */
export function scheduleEvent(
  userId: string,
  title: string,
  startTimeIso: string,
  endTimeIso: string,
  description: string | null = null,
  categoryId: string | null = null,
  isRecurring: boolean = false,
): CalendarEvent {
  const newEvent: CalendarEvent = {
    id: uuidv4(),
    userId,
    title,
    description,
    start: new Date(startTimeIso),
    end: new Date(endTimeIso),
    isRecurring,
    categoryId,
  };
  events.push(newEvent);
  return newEvent;
}

// --- Sample Data Population ---

function populateSampleData() {
  const now = new Date();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  // User 1
  scheduleEvent(
    "user1",
    "Team Meeting (User 1)",
    new Date(now.getTime() + 2 * oneHour).toISOString(), // In 2 hours
    new Date(now.getTime() + 3 * oneHour).toISOString(),
    "Weekly sync-up",
    "work",
    true
  );
  scheduleEvent(
    "user1",
    "Project Deadline (User 1)",
    new Date(now.getTime() + 3 * oneDay).toISOString(), // In 3 days
    new Date(now.getTime() + 3 * oneDay + oneHour).toISOString(),
    "Finalize Q3 report",
    "work"
  );
  scheduleEvent(
    "user1",
    "Past Event: Lunch with Bob (User 1)",
    new Date(now.getTime() - 2 * oneDay).toISOString(), // 2 days ago
    new Date(now.getTime() - 2 * oneDay + oneHour).toISOString(),
    "Discuss project X",
    "personal"
  );

  // User 2
  scheduleEvent(
    "user2",
    "Doctor's Appointment (User 2)",
    new Date(now.getTime() + oneDay + 4 * oneHour).toISOString(), // Tomorrow + 4 hours
    new Date(now.getTime() + oneDay + 5 * oneHour).toISOString(),
    "Annual check-up",
    "health"
  );
  scheduleEvent(
    "user2",
    "Gym Session (User 2)",
    new Date(now.getTime() + 2 * oneHour + 30 * 60 * 1000).toISOString(), // In 2.5 hours
    new Date(now.getTime() + 4 * oneHour).toISOString(),
    "Leg day",
    "health",
    true
  );
   scheduleEvent(
    "user2",
    "Past Event: Movie Night (User 2)",
    new Date(now.getTime() - 1 * oneDay).toISOString(), // Yesterday
    new Date(now.getTime() - 1 * oneDay + 2 * oneHour).toISOString(),
    "Watch new action movie",
    "social"
  );
}

populateSampleData();

// For demonstration and testing purposes (optional)
// console.log("Initial events for user1:", getUpcomingEvents("user1"));
// console.log("Initial events for user2:", getUpcomingEvents("user2"));
// const newEventForUser1 = scheduleEvent("user1", "Quick Chat", new Date(Date.now() + 5*oneHour).toISOString(), new Date(Date.now() + 6*oneHour).toISOString());
// console.log("After adding new event for user1:", getUpcomingEvents("user1"));
// console.log("All events:", events);

// To compile this file, you would run `npx tsc` in the `mcp-server` directory.
// Ensure you have `typescript` and `uuid` and their types installed:
// pnpm add typescript @types/node @types/uuid uuid
// The tsconfig.json should be in mcp-server/
// The output will be in mcp-server/build/dataSource.js
// The `src` directory should be at `mcp-server/src/`
// The command `pnpm tsc` can be added to package.json scripts
```
