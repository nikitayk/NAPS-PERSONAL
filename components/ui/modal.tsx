"use client"

import type React from "react"
import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModalProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function Modal({ title, children, isOpen, onClose, className = "" }: ModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />

      <div
        className={`fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-md overflow-auto rounded-lg cyber-card border-cyber-primary/30 -translate-x-1/2 -translate-y-1/2 ${className}`}
      >
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary to-cyber-secondary"></div>

          <div className="flex items-center justify-between p-4 border-b border-cyber-primary/20">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-cyber-primary/10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  )
}
