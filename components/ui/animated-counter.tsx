"use client"

import { useEffect, useState } from "react"
import { useSpring, useMotionValue } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 1, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const springValue = useSpring(useMotionValue(0), {
    stiffness: 100,
    damping: 30,
    duration,
  })

  useEffect(() => {
    springValue.set(value)
    const unsubscribe = springValue.onChange((v) => {
      setDisplayValue(Math.round(v))
    })
    return unsubscribe
  }, [springValue, value])

  return <span className={className}>{displayValue}</span>
}
