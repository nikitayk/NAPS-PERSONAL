"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/app-context"

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your financial assistant. How can I help you today?",
    },
  ])

  const { addGems } = useAppContext()

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to conversation
    setConversation([...conversation, { role: "user", content: message }])

    // Clear input
    setMessage("")

    // Simulate assistant response
    setTimeout(() => {
      let response = "I'm sorry, I don't have enough information to help with that yet."

      // Simple pattern matching for demo purposes
      if (message.toLowerCase().includes("budget")) {
        response =
          "Creating a budget is a great first step! Start by tracking your income and expenses, then set realistic spending limits for each category."
      } else if (message.toLowerCase().includes("fraud")) {
        response =
          "To protect yourself from fraud, always verify the source of communications, use strong passwords, and regularly monitor your accounts for suspicious activity."
      } else if (message.toLowerCase().includes("save") || message.toLowerCase().includes("saving")) {
        response =
          "For saving money, try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment."
      }

      setConversation((prev) => [...prev, { role: "assistant", content: response }])

      // Reward user for engaging with the assistant
      addGems(2)
    }, 1000)
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
              />
              <Button
                className="bg-cyber-primary text-black hover:bg-cyber-primary/90"
                size="icon"
                onClick={handleSendMessage}
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
