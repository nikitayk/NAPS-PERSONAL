"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const MotionBadge = motion(Badge)

interface AnimatedBadgeProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedBadge({ children, className, delay = 0 }: AnimatedBadgeProps) {
  return (
    <MotionBadge
      className={cn("origin-center", className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay,
      }}
    >
      {children}
    </MotionBadge>
  )
}
