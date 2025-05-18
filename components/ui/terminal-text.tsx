"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TerminalTextProps {
  text: string
  className?: string
  typingSpeed?: number
  startDelay?: number
}

export function TerminalText({ text, className, typingSpeed = 50, startDelay = 0 }: TerminalTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Start delay
    timeout = setTimeout(() => {
      setIsTyping(true)

      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, typingSpeed)

      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [text, typingSpeed, startDelay])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className={cn("", className)}>
      {displayText}
      {(isTyping || cursorVisible) && <span className="text-cyber-primary">|</span>}
    </span>
  )
}
