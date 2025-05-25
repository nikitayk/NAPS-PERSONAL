"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/app-context"
import { format } from "date-fns"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your financial assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { addGems, user } = useAppContext()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [conversation])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: message, timestamp: new Date() }])
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          user: {
            name: user?.name,
            gems: user?.gems,
            streak: user?.streak,
            avatar: user?.avatar,
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to connect to assistant.")
      }

      const data = await res.json()
      setConversation((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: data.reply || "Sorry, I couldn't find an answer for that.",
          timestamp: new Date()
        },
      ])
      addGems(2) // Reward user for engaging
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, I couldn't connect to the assistant right now.",
          timestamp: new Date()
        },
      ])
      setError("Failed to connect to assistant.")
    } finally {
      setLoading(false)
      setMessage("")
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    messages.forEach((message) => {
      const date = format(message.timestamp, "MMMM d, yyyy")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }

  const messageGroups = groupMessagesByDate(conversation)

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-cyber-primary text-black shadow-lg hover:bg-cyber-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 bg-cyber-dark border border-cyber-primary/30 rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex items-center justify-between p-3 border-b border-cyber-primary/20 bg-cyber-primary/10">
            <h3 className="font-medium text-cyber-primary">Financial Assistant</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Object.entries(messageGroups).map(([date, messages]) => (
              <div key={date} className="space-y-4">
                <div className="text-xs text-center text-muted-foreground">{date}</div>
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user" ? "bg-cyber-primary/20 text-white" : "bg-cyber-primary/10 text-cyber-primary"
                      }`}
                    >
                      {msg.content}
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(msg.timestamp, "HH:mm")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-cyber-primary/10 text-cyber-primary">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-cyber-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-cyber-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-cyber-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-red-500/20 text-red-400">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-cyber-primary/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask a financial question..."
                className="flex-1 bg-cyber-dark border border-cyber-primary/30 rounded p-2 text-sm focus:outline-none focus:border-cyber-primary"
                disabled={loading}
              />
              <Button
                className="bg-cyber-primary text-black hover:bg-cyber-primary/90"
                size="icon"
                onClick={handleSendMessage}
                disabled={loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
