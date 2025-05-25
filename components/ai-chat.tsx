"use client"

import { useState, useRef, useEffect } from "react"
// import Groq from "groq-sdk"; // Removed
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
    // const [showSuggestion, setShowSuggestion] = useState(false) // Removed as per new logic
    // const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null) // Removed as per new logic
  const [currentSuggestion, setCurrentSuggestion] = useState<Activity | null>(null);
  const [suggestionMessageId, setSuggestionMessageId] = useState<string | null>(null);

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

    // Capture history before adding the new user message
    const chatHistory = messages.slice(-3).map(msg => ({ role: msg.role, content: msg.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input after message is sent
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content, // Use userMessage.content as input is cleared
          history: chatHistory,
        }),
      });

      let assistantMessage: Message;

      if (response.ok) {
        const data = await response.json();
        const newAssistantMessageId = Date.now().toString();
        assistantMessage = {
          id: newAssistantMessageId,
          role: "assistant",
          content: data.response || "Sorry, I received an empty response.",
        };

        if (data.suggestedActivity) {
          const { title, start, end, description, categoryId } = data.suggestedActivity;
          if (title && start && end && categoryId) {
            // Ensure start and end are Date objects
            const startDate = typeof start === 'string' ? new Date(start) : start;
            const endDate = typeof end === 'string' ? new Date(end) : end;

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              setCurrentSuggestion({
                id: `sugg-${newAssistantMessageId}`, // Create a unique ID for the activity
                title,
                start: startDate,
                end: endDate,
                description: description || "",
                categoryId,
              });
              setSuggestionMessageId(newAssistantMessageId);
            } else {
              console.warn("Received suggestedActivity with invalid date(s):", data.suggestedActivity);
            }
          } else {
            console.warn("Received suggestedActivity with missing required fields:", data.suggestedActivity);
          }
        }

      } else {
        const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty obj
        console.error("Error calling /api/chat:", response.status, response.statusText, errorData);
        assistantMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, I couldn't connect to the AI assistant. Error: ${response.statusText || 'Unknown error'}`,
        };
      }
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Fetch error in handleSend:", error);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, there was an issue reaching the AI assistant. Please check your connection and try again.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Removing old suggestion handlers as AI will provide suggestions in text.
  // These can be re-added or adapted if structured suggestions are needed later.
  const handleAcceptSuggestion = () => {
    if (currentSuggestion) {
      onSuggestionAccept(currentSuggestion);
      setCurrentSuggestion(null);
      setSuggestionMessageId(null);
    }
  };

  const handleIgnoreSuggestion = () => {
    setCurrentSuggestion(null);
    setSuggestionMessageId(null);
  };

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
                  {message.role === "assistant" && message.id === suggestionMessageId && currentSuggestion && (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-sm font-medium mb-2">
                        AI suggests: {currentSuggestion.title}
                        <br />
                        <span className="text-xs">
                          From: {currentSuggestion.start.toLocaleString()}
                          <br />
                          To: {currentSuggestion.end.toLocaleString()}
                        </span>
                        {currentSuggestion.description && <><br/><span className="text-xs">Details: {currentSuggestion.description}</span></>}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleAcceptSuggestion} className="w-full bg-green-600 hover:bg-green-700">
                          Add to Calendar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleIgnoreSuggestion} className="w-full">
                          Ignore
                        </Button>
                      </div>
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
