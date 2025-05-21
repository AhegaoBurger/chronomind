"use client"

import { useState, useMemo } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChevronLeft, ChevronRight } from "lucide-react"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import { addDays, isSameDay, startOfDay, endOfDay, addMonths } from "date-fns"
import type { Activity, Category } from "@/types/activity"
import { defaultCategories } from "@/types/activity"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, CalendarIcon, RepeatIcon } from "lucide-react"

// Sample data - in a real app, this would come from Supabase
const sampleActivities: Activity[] = [
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
]

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarProps {
  onActivityClick: (activity: Activity) => void
  categories?: Category[]
  activities: Activity[]
}

export function Calendar({ onActivityClick, categories = defaultCategories, activities }: CalendarProps) {
  const [view, setView] = useState<"day" | "week" | "month" | "agenda">("week")
  const [date, setDate] = useState(new Date(2025, 4, 13)) // May 13, 2025

  // Function to expand recurring events
  const expandRecurringEvents = (activities: Activity[], start: Date, end: Date): Activity[] => {
    const expandedActivities: Activity[] = []

    activities.forEach((activity) => {
      if (!activity.isRecurring) {
        // For non-recurring activities, just check if they fall within the range
        if (
          (activity.start >= start && activity.start <= end) ||
          (activity.end >= start && activity.end <= end) ||
          (activity.start <= start && activity.end >= end)
        ) {
          expandedActivities.push(activity)
        }
        return
      }

      // For recurring activities
      const rule = activity.recurrenceRule
      if (!rule) return

      // Check if recurrence has ended
      if (rule.until && rule.until < start) return

      // Calculate the date range to check
      const rangeStart = new Date(Math.max(activity.start.getTime(), start.getTime()))
      const rangeEnd = rule.until ? new Date(Math.min(end.getTime(), rule.until.getTime())) : end

      // Daily recurrence
      if (rule.type === "daily") {
        const currentDate = new Date(rangeStart)
        currentDate.setHours(activity.start.getHours(), activity.start.getMinutes(), 0, 0)

        while (currentDate <= rangeEnd) {
          const eventStart = new Date(currentDate)
          const eventEnd = new Date(eventStart.getTime() + (activity.end.getTime() - activity.start.getTime()))

          expandedActivities.push({
            ...activity,
            id: `${activity.id}-${eventStart.toISOString()}`,
            start: eventStart,
            end: eventEnd,
            originalId: activity.id,
          })

          currentDate.setDate(currentDate.getDate() + 1)
        }
      }

      // Weekly recurrence
      else if (rule.type === "weekly" && rule.days && rule.days.length > 0) {
        const currentDate = new Date(rangeStart)
        currentDate.setHours(activity.start.getHours(), activity.start.getMinutes(), 0, 0)

        while (currentDate <= rangeEnd) {
          const dayOfWeek = currentDate.getDay()

          if (rule.days.includes(dayOfWeek)) {
            const eventStart = new Date(currentDate)
            const eventEnd = new Date(eventStart.getTime() + (activity.end.getTime() - activity.start.getTime()))

            expandedActivities.push({
              ...activity,
              id: `${activity.id}-${eventStart.toISOString()}`,
              start: eventStart,
              end: eventEnd,
              originalId: activity.id,
            })
          }

          currentDate.setDate(currentDate.getDate() + 1)
        }
      }

      // Monthly recurrence
      else if (rule.type === "monthly") {
        const activityDay = activity.start.getDate()
        let currentMonth = rangeStart.getMonth()
        let currentYear = rangeStart.getFullYear()

        while (new Date(currentYear, currentMonth, 1) <= rangeEnd) {
          // Create a date for this month with the same day
          const monthlyDate = new Date(
            currentYear,
            currentMonth,
            activityDay,
            activity.start.getHours(),
            activity.start.getMinutes(),
          )

          // Check if this date is within our range and is valid
          if (
            monthlyDate >= rangeStart &&
            monthlyDate <= rangeEnd &&
            monthlyDate.getDate() === activityDay // Ensure it's a valid date (not Feb 30)
          ) {
            const eventStart = new Date(monthlyDate)
            const eventEnd = new Date(eventStart.getTime() + (activity.end.getTime() - activity.start.getTime()))

            expandedActivities.push({
              ...activity,
              id: `${activity.id}-${eventStart.toISOString()}`,
              start: eventStart,
              end: eventEnd,
              originalId: activity.id,
            })
          }

          // Move to next month
          currentMonth++
          if (currentMonth > 11) {
            currentMonth = 0
            currentYear++
          }
        }
      }
    })

    return expandedActivities
  }

  // Get expanded events for the current view
  const events = useMemo(() => {
    // Determine date range based on current view
    let rangeStart: Date, rangeEnd: Date

    if (view === "day") {
      rangeStart = startOfDay(date)
      rangeEnd = endOfDay(date)
    } else if (view === "week") {
      rangeStart = startOfWeek(date, { locale: enUS })
      rangeEnd = addDays(rangeStart, 6)
      rangeEnd = endOfDay(rangeEnd)
    } else {
      // For month and agenda views, use a larger range
      rangeStart = new Date(date.getFullYear(), date.getMonth(), 1)
      rangeEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      rangeEnd = endOfDay(rangeEnd)
    }

    // Expand recurring events
    const expandedEvents = expandRecurringEvents(activities, rangeStart, rangeEnd)

    // Map to calendar events with styling
    return expandedEvents.map((activity) => {
      const category = categories.find((c) => c.id === activity.categoryId)

      return {
        ...activity,
        title: activity.title,
        start: activity.start,
        end: activity.end,
        allDay: false,
        resource: {
          categoryColor: category?.color || "#6b7280",
          isRecurring: activity.isRecurring,
          description: activity.description,
          categoryName: category?.name || "No Category",
        },
      }
    })
  }, [date, view, categories, activities])

  // Custom event component
  const EventComponent = ({ event }: any) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="h-full w-full overflow-hidden rounded-md px-2 py-1 text-sm" // Added text-sm for consistency
              style={{ backgroundColor: event.resource.categoryColor }}
            >
              <div className="flex items-center gap-1.5 text-white"> {/* Increased gap slightly */}
                <span className="font-semibold truncate">{event.title}</span> {/* Changed to font-semibold */}
                {event.isRecurring && <RepeatIcon className="h-3.5 w-3.5 opacity-80" />} {/* Slightly larger icon and opacity */}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs bg-card border-border p-3"> {/* Added bg-card, border, and padding */}
            <div className="space-y-1.5"> {/* Reduced space-y slightly */}
              <div className="font-semibold text-base">{event.title}</div> {/* Increased font size for title */}
              {event.resource.categoryName && (
                <div className="flex items-center text-xs text-muted-foreground"> {/* Used text-muted-foreground */}
                  <div
                    className="mr-2 h-2.5 w-2.5 rounded-full" /* Slightly larger dot and margin */
                    style={{ backgroundColor: event.resource.categoryColor }}
                  />
                  {event.resource.categoryName}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"> {/* Used text-muted-foreground, increased gap */}
                <Clock className="h-3.5 w-3.5" /> {/* Slightly larger icon */}
                <span>
                  {format(event.start, "p")} - {format(event.end, "p")} {/* Using short time format 'p' */}
                </span>
              </div>
              {event.description && (
                <div className="text-xs text-foreground/80 py-1">{event.description}</div> /* Used foreground opacity, added padding */
              )}
              {event.isRecurring && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"> {/* Used text-muted-foreground, increased gap */}
                  <RepeatIcon className="h-3.5 w-3.5" /> {/* Slightly larger icon */}
                  <span>Recurring event</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToToday = () => {
      toolbar.onNavigate("TODAY")
    }

    const goToPrev = () => {
      toolbar.onNavigate("PREV")
    }

    const goToNext = () => {
      toolbar.onNavigate("NEXT")
    }

    const viewOptions = [
      { key: "month", label: "Month" },
      { key: "week", label: "Week" },
      { key: "day", label: "Day" },
      { key: "agenda", label: "Agenda" },
    ]

    return (
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button onClick={goToToday} variant="outline">
            Today
          </Button>
          <div className="flex items-center">
            <Button onClick={goToPrev} variant="outline" size="icon" aria-label="Previous period">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={goToNext} variant="outline" size="icon" aria-label="Next period" className="ml-[-1px] rounded-l-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold sm:text-xl">
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              {toolbar.label}
            </span>
          </h2>
        </div>

        <ToggleGroup
          type="single"
          value={toolbar.view}
          onValueChange={(value) => {
            if (value) toolbar.onView(value)
          }}
          aria-label="Calendar view"
        >
          {viewOptions.map((viewOption) => (
            <ToggleGroupItem
              key={viewOption.key}
              value={viewOption.key}
              aria-label={viewOption.label}
              className="px-3 py-1.5"
            >
              {viewOption.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardContent className="p-0 sm:p-6">
        <div className="h-[calc(100vh-12rem)]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView: any) => setView(newView)}
            date={date}
            onNavigate={setDate}
            onSelectEvent={(event) => {
              // Find the original activity
              const originalId = event.originalId || event.id
              const activity = activities.find((a) => a.id === originalId)
              if (activity) {
                onActivityClick(activity)
              }
            }}
            components={{
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: "transparent",
                border: "none",
              },
            })}
            dayPropGetter={(date) => ({
              style: {
                backgroundColor: isSameDay(date, new Date()) ? "rgba(16, 185, 129, 0.05)" : undefined,
              },
            })}
            className="rounded-md"
          />
        </div>
      </CardContent>
    </Card>
  )
}
