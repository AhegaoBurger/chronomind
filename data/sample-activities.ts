import type { Activity } from "@/types/activity"
import { addMonths } from "date-fns"

// Sample data - in a real app, this would come from Supabase
export const sampleActivities: Activity[] = [
  // Work activities
  {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync with product and engineering",
    start: new Date(2025, 4, 13, 10, 0), // May 13, 2025, 10:00 AM
    end: new Date(2025, 4, 13, 11, 0),
    isRecurring: true,
    categoryId: "work",
    recurrenceRule: {
      type: "weekly",
      days: [2], // Tuesday
      until: addMonths(new Date(2025, 4, 13), 3), // 3 months from start
    },
  },
  {
    id: "2",
    title: "Project Planning",
    description: "Quarterly planning session for Q3",
    start: new Date(2025, 4, 15, 14, 0), // May 15, 2025, 2:00 PM
    end: new Date(2025, 4, 15, 16, 0),
    isRecurring: false,
    categoryId: "work",
  },
  {
    id: "3",
    title: "Client Call",
    description: "Monthly progress update with client",
    start: new Date(2025, 4, 14, 11, 0), // May 14, 2025, 11:00 AM
    end: new Date(2025, 4, 14, 12, 0),
    isRecurring: true,
    categoryId: "work",
    recurrenceRule: {
      type: "monthly",
      days: [14], // 14th of each month
      until: null, // Never ends
    },
  },

  // Health activities
  {
    id: "4",
    title: "Morning Workout",
    description: "Strength training session",
    start: new Date(2025, 4, 13, 7, 0), // May 13, 2025, 7:00 AM
    end: new Date(2025, 4, 13, 8, 0),
    isRecurring: true,
    categoryId: "health",
    recurrenceRule: {
      type: "weekly",
      days: [1, 3, 5], // Monday, Wednesday, Friday
      until: null, // Never ends
    },
  },
  {
    id: "5",
    title: "Yoga Class",
    description: "Vinyasa flow with Sarah",
    start: new Date(2025, 4, 16, 18, 0), // May 16, 2025, 6:00 PM
    end: new Date(2025, 4, 16, 19, 0),
    isRecurring: true,
    categoryId: "health",
    recurrenceRule: {
      type: "weekly",
      days: [5], // Friday
      until: null, // Never ends
    },
  },

  // Study activities
  {
    id: "6",
    title: "AI Course",
    description: "Online lecture on machine learning",
    start: new Date(2025, 4, 12, 19, 0), // May 12, 2025, 7:00 PM
    end: new Date(2025, 4, 12, 21, 0),
    isRecurring: true,
    categoryId: "study",
    recurrenceRule: {
      type: "weekly",
      days: [1], // Monday
      until: addMonths(new Date(2025, 4, 12), 2), // 2 months from start
    },
  },

  // Personal activities
  {
    id: "7",
    title: "Grocery Shopping",
    description: "Weekly grocery run",
    start: new Date(2025, 4, 17, 10, 0), // May 17, 2025, 10:00 AM
    end: new Date(2025, 4, 17, 11, 30),
    isRecurring: true,
    categoryId: "errands",
    recurrenceRule: {
      type: "weekly",
      days: [6], // Saturday
      until: null, // Never ends
    },
  },

  // Social activities
  {
    id: "8",
    title: "Dinner with Friends",
    description: "At Bella Italia restaurant",
    start: new Date(2025, 4, 16, 19, 30), // May 16, 2025, 7:30 PM
    end: new Date(2025, 4, 16, 22, 0),
    isRecurring: false,
    categoryId: "social",
  },

  // Family activities
  {
    id: "9",
    title: "Family Game Night",
    description: "Board games and pizza",
    start: new Date(2025, 4, 17, 18, 0), // May 17, 2025, 6:00 PM
    end: new Date(2025, 4, 17, 21, 0),
    isRecurring: true,
    categoryId: "family",
    recurrenceRule: {
      type: "weekly",
      days: [6], // Saturday
      until: null, // Never ends
    },
  },

  // One-time events
  {
    id: "10",
    title: "Dentist Appointment",
    description: "Annual checkup",
    start: new Date(2025, 4, 14, 15, 0), // May 14, 2025, 3:00 PM
    end: new Date(2025, 4, 14, 16, 0),
    isRecurring: false,
    categoryId: "health",
  },
  {
    id: "11",
    title: "Concert",
    description: "Live music at Central Park",
    start: new Date(2025, 4, 15, 20, 0), // May 15, 2025, 8:00 PM
    end: new Date(2025, 4, 15, 23, 0),
    isRecurring: false,
    categoryId: "social",
  },
  {
    id: "12",
    title: "Book Club",
    description: "Discussion on 'The Midnight Library'",
    start: new Date(2025, 4, 13, 19, 0), // May 13, 2025, 7:00 PM
    end: new Date(2025, 4, 13, 20, 30),
    isRecurring: true,
    categoryId: "social",
    recurrenceRule: {
      type: "monthly",
      days: [13], // 13th of each month
      until: null, // Never ends
    },
  },
  {
    id: "13",
    title: "Submit Project Proposal",
    description: "Finalize and submit Q3 project proposal",
    start: new Date(2025, 4, 19, 16, 0), // May 19, 2025, 4:00 PM
    end: new Date(2025, 4, 19, 17, 0),
    isRecurring: false,
    categoryId: "work",
  },
]
