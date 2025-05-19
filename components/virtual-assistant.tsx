"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/app-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your financial assistant. How can I help you today?",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addGems, user } = useAppContext()

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: message }])
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
            // Add any other personalization fields you want
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to connect to assistant.")
      }

      const data = await res.json()
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I couldn't find an answer for that." },
      ])
      addGems(2) // Reward user for engaging
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect to the assistant right now." },
      ])
      setError("Failed to connect to assistant.")
    } finally {
      setLoading(false)
      setMessage("")
    }
  }

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
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user" ? "bg-cyber-primary/20 text-white" : "bg-cyber-primary/10 text-cyber-primary"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-cyber-primary/10 text-cyber-primary animate-pulse">
                  Thinking...
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
