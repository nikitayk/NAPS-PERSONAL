"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Shield, PieChart } from "lucide-react"

export function FinancialVisualization() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Sample data for the chart
  const chartData = [
    { month: "Jan", savings: 200, expenses: 800 },
    { month: "Feb", savings: 300, expenses: 750 },
    { month: "Mar", savings: 400, expenses: 700 },
    { month: "Apr", savings: 500, expenses: 650 },
    { month: "May", savings: 600, expenses: 600 },
    { month: "Jun", savings: 700, expenses: 550 },
  ]

  // Calculate the maximum value for scaling
  const maxValue = Math.max(...chartData.map((d) => d.savings + d.expenses))

  // Budget allocation data for the pie chart
  const budgetData = [
    { category: "Housing", percentage: 35, color: "rgba(0, 255, 170, 0.8)" },
    { category: "Food", percentage: 15, color: "rgba(0, 200, 255, 0.8)" },
    { category: "Transport", percentage: 10, color: "rgba(170, 0, 255, 0.8)" },
    { category: "Savings", percentage: 20, color: "rgba(255, 215, 0, 0.8)" },
    { category: "Other", percentage: 20, color: "rgba(255, 100, 100, 0.8)" },
  ]

  return (
    <div ref={containerRef} className="relative w-full h-full max-w-md mx-auto">
      {/* Background elements */}
      <div className="absolute inset-0 rounded-full bg-black/30 border border-cyber-primary/20"></div>

      {/* Central hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-black border-2 border-cyber-primary flex items-center justify-center z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={isVisible ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="text-cyber-primary text-xl font-bold"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          NAPS
        </motion.div>
      </motion.div>

      {/* Orbiting elements */}
      {[DollarSign, TrendingUp, Shield, PieChart].map((Icon, index) => {
        const angle = (index * Math.PI * 2) / 4
        const delay = 0.3 + index * 0.1
        const distance = 120
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-cyber-primary/10 border border-cyber-primary flex items-center justify-center z-10"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={
              isVisible
                ? {
                    x,
                    y,
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.7,
              delay,
              type: "spring",
              stiffness: 100,
            }}
          >
            <Icon className="h-6 w-6 text-cyber-primary" />

            {/* Connecting line */}
            <motion.div
              className="absolute top-1/2 left-1/2 h-0.5 bg-cyber-primary/30 origin-left z-0"
              style={{
                width: distance,
                rotate: `${angle * (180 / Math.PI)}deg`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isVisible ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            />
          </motion.div>
        )
      })}

      {/* Savings growth chart */}
      <div className="absolute bottom-[15%] left-[15%] w-[30%] h-[25%]">
        <motion.div
          className="absolute inset-0 bg-black/50 rounded-lg border border-cyber-primary/30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="p-2 text-xs text-cyber-primary font-medium">Savings Growth</div>
          <div className="relative h-[70%] w-full px-2 pt-1 flex items-end justify-between">
            {chartData.map((data, index) => {
              const height = (data.savings / maxValue) * 100

              return (
                <motion.div
                  key={index}
                  className="relative h-full flex-1 flex items-end justify-center"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                >
                  <motion.div
                    className="w-[60%] bg-gradient-to-t from-cyber-primary to-cyber-secondary rounded-sm"
                    initial={{ height: 0 }}
                    animate={isVisible ? { height: `${height}%` } : {}}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Budget allocation pie chart */}
      <div className="absolute top-[15%] right-[15%] w-[30%] h-[25%]">
        <motion.div
          className="absolute inset-0 bg-black/50 rounded-lg border border-cyber-primary/30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="p-2 text-xs text-cyber-primary font-medium">Budget Allocation</div>
          <div className="relative h-[70%] w-full flex items-center justify-center">
            <div className="relative w-[80%] h-[80%]">
              {budgetData.map((segment, index) => {
                const startAngle = budgetData.slice(0, index).reduce((sum, d) => sum + d.percentage, 0) * 3.6
                const endAngle = startAngle + segment.percentage * 3.6

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <motion.path
                        d={describeArc(50, 50, 40, startAngle, endAngle)}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="20"
                        initial={{ pathLength: 0 }}
                        animate={isVisible ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      />
                    </svg>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyber-primary/20"
          style={{
            width: `${70 + ring * 20}%`,
            height: `${70 + ring * 20}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isVisible
              ? {
                  opacity: 0.3,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: 1.5,
            delay: 0.2 + ring * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: ring * 0.5,
          }}
        />
      ))}

      {/* Data points that orbit around */}
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index * Math.PI * 2) / 8
        const delay = 1.5 + index * 0.1
        const distance = 140
        const orbitDuration = 20 + index * 5

        return (
          <motion.div
            key={`data-point-${index}`}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyber-primary z-10"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: [0, 1, 1, 0] } : {}}
            transition={{
              duration: 3,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: index * 0.5,
            }}
            style={{
              x: `calc(${Math.cos(angle) * distance}px - 4px)`,
              y: `calc(${Math.sin(angle) * distance}px - 4px)`,
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-full bg-cyber-primary"
              animate={{
                x: Array.from({ length: 20 }).map(() => Math.cos(Math.random() * Math.PI * 2) * distance),
                y: Array.from({ length: 20 }).map(() => Math.sin(Math.random() * Math.PI * 2) * distance),
              }}
              transition={{
                duration: orbitDuration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </motion.div>
        )
      })}

      {/* Financial metrics */}
      <motion.div
        className="absolute bottom-[15%] right-[15%] bg-black/50 rounded-lg border border-cyber-primary/30 p-3 w-[30%]"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="text-xs text-cyber-primary font-medium mb-2">Financial Health</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Savings Rate</span>
            <motion.div
              className="h-1.5 w-[70%] bg-muted/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <motion.div
                className="h-full bg-cyber-primary rounded-full"
                initial={{ width: 0 }}
                animate={isVisible ? { width: "65%" } : {}}
                transition={{ duration: 0.8, delay: 1.4 }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Debt Ratio</span>
            <motion.div
              className="h-1.5 w-[70%] bg-muted/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <motion.div
                className="h-full bg-cyber-primary rounded-full"
                initial={{ width: 0 }}
                animate={isVisible ? { width: "25%" } : {}}
                transition={{ duration: 0.8, delay: 1.6 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Fraud protection metrics */}
      <motion.div
        className="absolute top-[15%] left-[15%] bg-black/50 rounded-lg border border-cyber-primary/30 p-3 w-[30%]"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <div className="text-xs text-cyber-primary font-medium mb-2">Fraud Protection</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Security Score</span>
            <motion.div
              className="h-1.5 w-[70%] bg-muted/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <motion.div
                className="h-full bg-cyber-primary rounded-full"
                initial={{ width: 0 }}
                animate={isVisible ? { width: "85%" } : {}}
                transition={{ duration: 0.8, delay: 1.8 }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Alerts</span>
            <motion.div
              className="h-1.5 w-[70%] bg-muted/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.9 }}
            >
              <motion.div
                className="h-full bg-cyber-primary rounded-full"
                initial={{ width: 0 }}
                animate={isVisible ? { width: "10%" } : {}}
                transition={{ duration: 0.8, delay: 2 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Helper function to create SVG arcs for the pie chart
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ")
}
