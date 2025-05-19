"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/toast-context"

function getTypeStyles(type: string = "info") {
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

export function ToastStack() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-md">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`border ${getTypeStyles(toast.type)} rounded-lg shadow-lg p-4`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-white">{toast.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => removeToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
