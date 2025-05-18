"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-cyber-dark z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-cyber-primary text-black font-bold text-4xl p-2 rounded">NAPS</div>
      </motion.div>

      <motion.div
        className="w-64 h-2 bg-cyber-dark border border-cyber-primary/30 rounded-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      <motion.div
        className="mt-4 text-cyber-primary text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="cyber-glow">Initializing financial systems...</div>
      </motion.div>

      <motion.div
        className="absolute inset-0 cyber-grid opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.2 }}
      />

      <div className="absolute top-0 left-0 w-full h-1 bg-cyber-primary/20"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-cyber-primary/20"></div>
      <div className="absolute top-0 left-0 w-1 h-full bg-cyber-primary/20"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-cyber-primary/20"></div>

      <motion.div
        className="absolute h-1 w-full bg-cyber-primary/10"
        animate={{
          top: ["0%", "100%", "0%"],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "linear",
        }}
      />
    </motion.div>
  )
}
