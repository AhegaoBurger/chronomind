"use client"

import { useState, useRef, useEffect } from "react"
import Groq from "groq-sdk";
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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn(
        "GROQ_API_KEY is not set. Please create a .env.local file and add your API key. For example: GROQ_API_KEY='your-api-key-here'"
      );
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "API Key not configured. Please ask the administrator to set the GROQ_API_KEY in the environment variables.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    const groq = new Groq({ apiKey });

    // Prepare messages for Groq API, including history
    const lastMessages = messages.slice(-3).map((msg) => ({ role: msg.role, content: msg.content }));
    const groqMessages = [
      { role: "system", content: "You are a helpful scheduling assistant. You can help users manage their calendar and schedule activities." },
      ...lastMessages,
      { role: "user", content: userMessage.content },
    ];

    try {
      const completion = await groq.chat.completions.create({
        messages: groqMessages as any, // Cast because Groq SDK might have stricter type for role
        model: "llama3-8b-8192",
      });

      const aiResponseContent = completion.choices[0]?.message?.content;
      console.log("Groq API Response:", aiResponseContent || "No content");

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent || "Sorry, I could not generate a response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error calling Groq API:", error);
      let errorMessage = "Sorry, I encountered an error trying to connect to the AI service.";
      if (error.message) {
        errorMessage += ` Details: ${error.message}`;
      }
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: errorMessage,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Removing old suggestion handlers as AI will provide suggestions in text.
  // These can be re-added or adapted if structured suggestions are needed later.
  // const handleAcceptSuggestion = () => { ... }
  // const handleDeclineSuggestion = () => { ... }

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
                  {/* Suggestion buttons are removed for now, AI will provide text-based suggestions */}
                  {/* {message.suggestion && message.suggestion.buttons && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptSuggestion()} className="w-full">
                        Add to Calendar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeclineSuggestion()} className="w-full">
                        No Thanks
                      </Button>
                    </div>
                  )} */}
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
