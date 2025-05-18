"use client"

import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CyberButtonProps extends ButtonProps {
  glitch?: boolean
  variant?: "cyber-default" | "cyber-outline"
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, children, glitch, variant = "cyber-default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden group",
          variant === "cyber-default" &&
            "bg-cyber-primary text-black hover:bg-cyber-primary/90 border border-cyber-primary/50",
          variant === "cyber-outline" &&
            "bg-transparent text-cyber-primary border border-cyber-primary hover:bg-cyber-primary/10",
          glitch &&
            "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-white/10 hover:after:animate-glitch",
          className,
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "cyber-default" && (
          <span className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        )}
      </Button>
    )
  },
)

CyberButton.displayName = "CyberButton"
