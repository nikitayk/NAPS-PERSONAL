"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface NotificationProps {
  title: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose: () => void
  show: boolean
}

export function Notification({ title, message, type = "info", duration = 5000, onClose, show }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)

    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-500/10"
      case "error":
        return "border-red-500 bg-red-500/10"
      case "warning":
        return "border-yellow-500 bg-yellow-500/10"
      default:
        return "border-cyber-primary bg-cyber-primary/10"
    }
  }

  if (!isVisible) return null

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-md border ${getTypeStyles()} rounded-lg shadow-lg p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => {
            setIsVisible(false)
            onClose()
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
