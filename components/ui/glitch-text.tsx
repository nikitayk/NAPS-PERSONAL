"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function GlitchText({ text, className, intensity = "low" }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    if (intensity === "low") return

    const glitchChars = "!<>-_\\/[]{}—=+*^?#________"
    let interval: NodeJS.Timeout

    const applyGlitch = () => {
      const randomChar = () => glitchChars[Math.floor(Math.random() * glitchChars.length)]
      const randomIndex = Math.floor(Math.random() * text.length)
      const randomLength = Math.floor(Math.random() * 3) + 1

      const newText = text.split("")
      for (let i = 0; i < randomLength; i++) {
        if (randomIndex + i < text.length) {
          newText[randomIndex + i] = randomChar()
        }
      }

      setDisplayText(newText.join(""))

      // Reset after a short delay
      setTimeout(() => {
        setDisplayText(text)
      }, 100)
    }

    const glitchFrequency = intensity === "high" ? 1000 : 2000

    interval = setInterval(applyGlitch, glitchFrequency)

    return () => clearInterval(interval)
  }, [text, intensity])

  return <span className={cn("relative", className)}>{displayText}</span>
}
