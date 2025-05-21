"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Activity } from "@/types/activity"
import { Send, Bot } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  suggestion?: {
    activity: Activity
    buttons: boolean
  }
}

interface AIChatProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuggestionAccept: (activity: Activity) => void
  activities: Activity[]
}

export function AIChat({ open, onOpenChange, onSuggestionAccept, activities }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your AI time management assistant. How can I help you organize your schedule today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      // Check if the message contains keywords related to scheduling
      const schedulingKeywords = [
        "schedule",
        "add",
        "create",
        "meeting",
        "appointment",
        "workout",
        "exercise",
        "study",
        "class",
      ]

      const containsSchedulingIntent = schedulingKeywords.some((keyword) => input.toLowerCase().includes(keyword))

      if (containsSchedulingIntent) {
        // Generate a suggested activity based on the user's message
        // Find a "free" slot on Wednesday evening
        const now = new Date()
        const nextWednesday = new Date(now)
        nextWednesday.setDate(now.getDate() + ((3 + 7 - now.getDay()) % 7)) // Next Wednesday
        nextWednesday.setHours(18, 0, 0, 0) // 6:00 PM

        const suggestedEnd = new Date(nextWednesday)
        suggestedEnd.setHours(19, 0, 0, 0) // 7:00 PM

        let title = "Meeting"
        if (input.toLowerCase().includes("workout") || input.toLowerCase().includes("exercise")) {
          title = "Workout Session"
        } else if (input.toLowerCase().includes("study") || input.toLowerCase().includes("class")) {
          title = "Study Session"
        } else if (input.toLowerCase().includes("appointment")) {
          title = "Appointment"
        }

        const activity: Activity = {
          id: Math.random().toString(36).substring(2, 9),
          title,
          description: "Suggested by AI assistant",
          start: nextWednesday,
          end: suggestedEnd,
          isRecurring: false,
          categoryId:
            input.toLowerCase().includes("workout") || input.toLowerCase().includes("exercise")
              ? "health"
              : input.toLowerCase().includes("study") || input.toLowerCase().includes("class")
                ? "study"
                : "personal",
        }

        setSuggestedActivity(activity)

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Of course, I understand your schedule is extremely packed, but I see there is free space on Wednesday evening at ${nextWednesday.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" },
          )} where you would be able to fit in this ${title.toLowerCase()}. Would you like me to add it to your calendar?`,
          suggestion: {
            activity,
            buttons: true,
          },
        }

        setMessages((prev) => [...prev, assistantMessage])
      } else {
        // Generic response for non-scheduling queries
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I'm here to help you manage your time effectively. You can ask me to schedule activities, suggest free time slots, or provide time management advice. Looking at your calendar, I notice you have some free time on Wednesday evenings - would you like to schedule something then?",
        }

        setMessages((prev) => [...prev, assistantMessage])
      }

      setIsLoading(false)
    }, 1000)
  }

  const handleAcceptSuggestion = () => {
    // Find the last message with a suggestion
    const lastSuggestionMessage = [...messages].reverse().find((m) => m.suggestion)

    if (lastSuggestionMessage?.suggestion?.activity) {
      const activity = lastSuggestionMessage.suggestion.activity
      onSuggestionAccept(activity)

      const acceptMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Great! I've added "${activity.title}" to your calendar for ${activity.start.toLocaleDateString()} at ${activity.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
      }

      setMessages((prev) => [...prev, acceptMessage])
    }
  }

  const handleDeclineSuggestion = () => {
    const declineMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "No problem. Is there another time that would work better for you?",
    }

    setMessages((prev) => [...prev, declineMessage])
    setShowSuggestion(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            AI Assistant
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-emerald-600 text-white" : "bg-muted"
                  }`}
                >
                  <div>{message.content}</div>

                  {message.suggestion && message.suggestion.buttons && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptSuggestion()} className="w-full">
                        Add to Calendar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeclineSuggestion()} className="w-full">
                        No Thanks
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-75"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
