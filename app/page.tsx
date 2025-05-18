"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Shield, Clock, BarChart3, CheckCircle, ChevronDown, ArrowRight, BookOpen, Target, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CyberButton } from "@/components/ui/cyber-button"
import { GlitchText } from "@/components/ui/glitch-text"
import { TerminalText } from "@/components/ui/terminal-text"
import { VirtualAssistant } from "@/components/virtual-assistant"
import { HelpGuide } from "@/components/help-guide"
import { FinancialVisualization } from "@/components/financial-visualization"
import { useAppContext } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import { Notification } from "@/components/notification"

export default function Home() {
  const router = useRouter()
  const {
    transactions,
    addGems,
    selectTransaction,
    showFraudAlert,
    toggleFraudAlert,
    showSuccessMessage,
    toggleSuccessMessage,
    checkFraudulentTransaction,
  } = useAppContext()

  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [showFraudModal, setShowFraudModal] = useState(false)
  const [showTourModal, setShowTourModal] = useState(false)
  const [currentTourStep, setCurrentTourStep] = useState(1)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    const scrollListener = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener("scroll", scrollListener)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", scrollListener)
    }
  }, [])

  // Feature carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Sample data for visualization
  const financialData = [
    { label: "Jan", value: 1200 },
    { label: "Feb", value: 1800 },
    { label: "Mar", value: 1400 },
    { label: "Apr", value: 2200 },
    { label: "May", value: 1900 },
    { label: "Jun", value: 2800 },
  ]

  const handleTransactionSelect = (id: string) => {
    setSelectedTransactionId(id)
    selectTransaction(id)
  }

  const handleCheckAnswer = () => {
    if (selectedTransactionId) {
      const isCorrect = checkFraudulentTransaction(selectedTransactionId)

      if (isCorrect) {
        addGems(20)
        toggleSuccessMessage(true)
      } else {
        toggleFraudAlert(true)
      }

      setShowFraudModal(false)
    }
  }

  const handleStartLearning = () => {
    router.push("/learn")
  }

  const handleTakeTour = () => {
    setShowTourModal(true)
  }

  const nextTourStep = () => {
    if (currentTourStep < 4) {
      setCurrentTourStep((prev) => prev + 1)
    } else {
      setShowTourModal(false)
      setCurrentTourStep(1)
    }
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          <GlitchText text="NAPS" className="text-6xl font-bold text-cyber-primary mb-4" intensity="medium" />
          <TerminalText
            text="Initializing financial security protocols..."
            className="text-cyber-primary"
            typingSpeed={30}
          />
          <div className="mt-8 w-64 mx-auto">
            <div className="h-1 w-full bg-cyber-dark overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black/90 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            <div className="container py-20 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="mb-4 bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30 py-1.5">
                    FINANCIAL EDUCATION REIMAGINED
                  </Badge>

                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <GlitchText
                      text="Navigate and Plan Smartly"
                      className="block mb-2 text-cyber-primary"
                      intensity="low"
                    />
                  </h1>

                  <TerminalText
                    text="Master your finances, protect your future, and build wealth with confidence."
                    className="text-lg md:text-xl text-muted-foreground mb-8"
                    typingSpeed={10}
                    startDelay={1000}
                  />

                  <div className="flex flex-col sm:flex-row gap-4">
                    <CyberButton className="px-8 py-6" glitch onClick={handleStartLearning}>
                      Start Learning
                    </CyberButton>

                    <CyberButton variant="cyber-outline" className="px-8 py-6" onClick={handleTakeTour}>
                      Take a Tour
                    </CyberButton>
                  </div>

                  <p className="mt-6 text-sm text-muted-foreground">
                    Join 10,000+ students already mastering their finances
                  </p>
                </div>

                <div className="relative">
                  {/* Replace the old circle with our new financial visualization */}
                  <FinancialVisualization />
                </div>
              </div>

              {/* Scroll Indicator */}
              {showScrollIndicator && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                  <span className="text-cyber-primary text-sm mb-2">Scroll to explore</span>
                  <ChevronDown className="h-6 w-6 text-cyber-primary animate-bounce" />
                </div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>

            <div className="container relative z-10">
              <div className="text-center mb-16">
                <Badge className="mb-2 bg-cyber-dark text-cyber-secondary border-cyber-secondary/30">FEATURES</Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  <GlitchText text="Learn, Practice, Master" className="inline-block" intensity="low" />
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  NAPS makes financial education fun and engaging with interactive features designed to help you
                  succeed.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "AI-Driven Fraud Detection",
                    description:
                      "Our friendly AI assistant helps you spot suspicious activities and explains why they might be fraudulent.",
                    icon: Shield,
                    example:
                      "This transaction looks unusual because it occurred at 3:42 AM and doesn't match your normal spending patterns.",
                  },
                  {
                    title: "Gamified Financial Education",
                    description:
                      "Learn through fun challenges and earn rewards as you build your financial knowledge and skills.",
                    icon: Clock,
                    progress: true,
                  },
                  {
                    title: "Personalized Insights",
                    description: "Get tailored financial advice based on your spending patterns and goals.",
                    icon: BarChart3,
                    example: "You've spent 20% less on dining out this month! Keep it up to reach your savings goal.",
                  },
                  {
                    title: "Daily Challenges",
                    description: "Complete daily challenges to earn gems and build your streak!",
                    icon: CheckCircle,
                    progress: true,
                    value: 60,
                  },
                ].map((feature, index) => (
                  <Card key={index} className="cyber-card border-cyber-primary/30">
                    <div className="p-6">
                      <div className="w-12 h-12 rounded-full bg-cyber-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-cyber-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-cyber-primary">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>

                      {feature.example && (
                        <div className="p-4 border border-cyber-primary/20 bg-cyber-primary/5 rounded-md">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-cyber-primary">ℹ️</div>
                            <p className="text-sm">"{feature.example}"</p>
                          </div>
                        </div>
                      )}

                      {feature.progress && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Progress</h4>
                            {feature.value && <Badge className="bg-cyber-primary text-black">+20 💎</Badge>}
                          </div>
                          <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full"
                              style={{ width: `${feature.value || 40}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Feature Carousel for Mobile */}
              <div className="mt-12 md:hidden">
                <div className="relative overflow-hidden">
                  <div className="flex justify-center mb-4">
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 mx-1 rounded-full ${
                          activeFeature === index ? "bg-cyber-primary" : "bg-cyber-primary/20"
                        }`}
                        onClick={() => setActiveFeature(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Challenge Section */}
          <section className="py-16 relative">
            <div className="absolute inset-0 bg-cyber-primary/5 border-y border-cyber-primary/20"></div>

            <div className="container relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <GlitchText
                    text="Today's Challenge"
                    className="text-3xl font-bold text-cyber-primary mb-2"
                    intensity="low"
                  />
                  <p className="text-muted-foreground">Complete daily challenges to earn gems and build your streak!</p>
                </div>

                <Card className="cyber-card border-cyber-primary/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-cyber-primary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-cyber-primary" />
                      </div>
                      <div>
                        <CardTitle>Spot the Fraud</CardTitle>
                        <CardDescription>Identify which transaction might be fraudulent</CardDescription>
                      </div>
                      <Badge className="ml-auto bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30">
                        +20 💎
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className={`p-4 border ${
                            selectedTransactionId === transaction.id ? "border-cyber-primary" : "border-muted/20"
                          } rounded-md hover:border-cyber-primary/30 transition-colors cursor-pointer`}
                          onClick={() => handleTransactionSelect(transaction.id)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{transaction.merchant}</h4>
                              <p className="text-sm text-muted-foreground">
                                {transaction.date} - {transaction.time}
                              </p>
                            </div>
                            <div className="text-right font-medium">${transaction.amount.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full cyber-button text-black"
                      onClick={() => setShowFraudModal(true)}
                      disabled={!selectedTransactionId}
                    >
                      Check Answer
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20">
            <div className="container">
              <div className="text-center mb-12">
                <Badge className="mb-2 bg-cyber-dark text-cyber-secondary border-cyber-secondary/30">
                  TESTIMONIALS
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Meet Our <span className="text-cyber-primary">Happy Users</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Alex Morgan",
                    role: "Computer Science Major",
                    avatar: "green",
                    rating: 5,
                    testimonial:
                      "NAPS helped me identify a fraudulent transaction before it was too late. The explanations behind the fraud detection made me understand what to look out for in the future.",
                    gems: 245,
                    streak: 30,
                  },
                  {
                    name: "Ryan Kim",
                    role: "Engineering Student",
                    avatar: "purple",
                    rating: 5,
                    testimonial:
                      "The personalized insights have completely changed how I manage my money. I've saved over $500 this semester by following NAPS recommendations!",
                    gems: 312,
                    streak: 45,
                  },
                  {
                    name: "Jamie Taylor",
                    role: "Business Administration",
                    avatar: "blue",
                    rating: 4,
                    testimonial:
                      "The gamified learning experience made financial education fun! I've learned so much about budgeting and investing while earning rewards along the way.",
                    gems: 189,
                    streak: 15,
                  },
                ].map((user, index) => (
                  <Card key={index} className="cyber-card border-cyber-primary/30">
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar
                          className={`h-12 w-12 bg-${user.avatar}-500/20 border border-${user.avatar}-500/50 animate-pulse-glow`}
                        >
                          <AvatarFallback className={`text-${user.avatar}-500`}>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex mt-2">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i} className={i < user.rating ? "text-yellow-500" : "text-muted/30"}>
                              ★
                            </span>
                          ))}
                      </div>
                      <div className="mt-4 p-4 bg-cyber-primary/5 border border-cyber-primary/20 rounded-md">
                        <p className="text-sm text-muted-foreground">"{user.testimonial}"</p>
                      </div>
                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-muted/10">
                        <div className="flex items-center gap-1 text-purple-500">
                          <span className="text-sm font-medium">💎 {user.gems} gems</span>
                        </div>
                        <div className="flex items-center gap-1 text-orange-500">
                          <span className="text-sm font-medium">🔥 {user.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20"></div>

            <div className="container relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <GlitchText
                  text="Ready to take control of your finances?"
                  className="text-3xl md:text-5xl font-bold mb-4"
                  intensity="medium"
                />

                <p className="text-xl mb-8 text-muted-foreground">
                  Join thousands of students who are learning financial skills while having fun!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CyberButton className="px-8 py-6" glitch onClick={handleStartLearning}>
                    Get started for free
                  </CyberButton>

                  <CyberButton variant="cyber-outline" className="px-8 py-6" onClick={handleTakeTour}>
                    <span className="flex items-center">
                      Take a tour <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </CyberButton>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="py-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">How was your experience?</h2>
                <p className="text-muted-foreground">We'd love to hear your feedback!</p>
              </div>

              <div className="flex justify-center gap-8 mb-8">
                {[
                  { emoji: "😔", label: "Not good", color: "red" },
                  { emoji: "😐", label: "Okay", color: "yellow" },
                  { emoji: "😊", label: "Good", color: "green" },
                  { emoji: "😄", label: "Amazing", color: "cyber-primary" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-${item.color}-500/20 flex items-center justify-center mb-2 cursor-pointer hover:bg-${item.color}-500/30 transition-colors`}
                      onClick={() => {
                        setFeedbackRating(index)
                        setShowFeedbackModal(true)
                      }}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-cyber-primary/20 py-8 bg-black/50">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="bg-cyber-primary text-black font-bold text-xl p-1 rounded">NAPS</div>
                <p className="text-sm text-muted-foreground">
                  Navigate and Plan Smartly - Empowering college students with financial literacy and fraud protection.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">© 2025 NAPS. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>

      {/* Virtual Assistant */}
      <VirtualAssistant />

      {/* Help Guide */}
      <HelpGuide />

      {/* Modals */}
      <Modal title="Fraud Detection Challenge" isOpen={showFraudModal} onClose={() => setShowFraudModal(false)}>
        <div className="space-y-4">
          <p className="text-muted-foreground">Are you sure you want to select this transaction as fraudulent?</p>

          {selectedTransactionId && (
            <div className="p-4 border border-cyber-primary/20 rounded-md bg-cyber-primary/5">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{transactions.find((t) => t.id === selectedTransactionId)?.merchant}</h4>
                  <p className="text-sm text-muted-foreground">
                    {transactions.find((t) => t.id === selectedTransactionId)?.date} -
                    {transactions.find((t) => t.id === selectedTransactionId)?.time}
                  </p>
                </div>
                <div className="text-right font-medium">
                  ${transactions.find((t) => t.id === selectedTransactionId)?.amount.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowFraudModal(false)}>
              Cancel
            </Button>
            <Button className="bg-cyber-primary text-black" onClick={handleCheckAnswer}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal title="Platform Tour" isOpen={showTourModal} onClose={() => setShowTourModal(false)} className="max-w-2xl">
        <div className="space-y-6">
          <div className="relative">
            {currentTourStep === 1 && (
              <div>
                <h3 className="text-lg font-medium text-cyber-primary mb-2">Welcome to NAPS!</h3>
                <p className="text-muted-foreground mb-4">
                  Navigate and Plan Smartly is your all-in-one platform for financial literacy and fraud protection.
                </p>
                <div className="aspect-video bg-cyber-primary/5 border border-cyber-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <Shield className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                    <h4 className="text-xl font-medium">Financial Education Reimagined</h4>
                    <p className="text-muted-foreground mt-2">
                      Learn financial skills in an engaging, gamified environment
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentTourStep === 2 && (
              <div>
                <h3 className="text-lg font-medium text-cyber-primary mb-2">Learn at Your Own Pace</h3>
                <p className="text-muted-foreground mb-4">
                  Our structured learning paths help you master financial concepts step by step.
                </p>
                <div className="aspect-video bg-cyber-primary/5 border border-cyber-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <BookOpen className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                    <h4 className="text-xl font-medium">Interactive Lessons</h4>
                    <p className="text-muted-foreground mt-2">
                      Videos, articles, and interactive exercises to build your knowledge
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentTourStep === 3 && (
              <div>
                <h3 className="text-lg font-medium text-cyber-primary mb-2">Practice Your Skills</h3>
                <p className="text-muted-foreground mb-4">
                  Apply what you've learned through real-world scenarios and challenges.
                </p>
                <div className="aspect-video bg-cyber-primary/5 border border-cyber-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <Target className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                    <h4 className="text-xl font-medium">Daily Challenges</h4>
                    <p className="text-muted-foreground mt-2">Complete challenges to earn gems and build your streak</p>
                  </div>
                </div>
              </div>
            )}

            {currentTourStep === 4 && (
              <div>
                <h3 className="text-lg font-medium text-cyber-primary mb-2">Join Our Community</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with other users, share experiences, and learn from each other.
                </p>
                <div className="aspect-video bg-cyber-primary/5 border border-cyber-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <Users className="h-16 w-16 text-cyber-primary mx-auto mb-4" />
                    <h4 className="text-xl font-medium">Community Support</h4>
                    <p className="text-muted-foreground mt-2">
                      Ask questions, share success stories, and get advice from peers
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full ${currentTourStep === step ? "bg-cyber-primary" : "bg-muted/30"}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTourModal(false)}>
                Skip Tour
              </Button>
              <Button className="bg-cyber-primary text-black" onClick={nextTourStep}>
                {currentTourStep < 4 ? "Next" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal title="Thank You for Your Feedback" isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)}>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We appreciate your feedback! Would you like to tell us more about your experience?
          </p>

          <textarea
            className="w-full h-32 bg-cyber-dark border border-cyber-primary/30 rounded-md p-3 focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary outline-none"
            placeholder="What did you like or dislike about your experience?"
          ></textarea>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-cyber-primary text-black"
              onClick={() => {
                setShowFeedbackModal(false)
                toggleSuccessMessage(true)
                addGems(5)
              }}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notifications */}
      <Notification
        title="Suspicious Transaction Detected"
        message="We've detected unusual activity in your account. Please review your recent transactions."
        type="warning"
        show={showFraudAlert}
        onClose={() => toggleFraudAlert(false)}
      />

      <Notification
        title="Challenge Completed!"
        message="Congratulations! You've earned gems for completing the challenge."
        type="success"
        show={showSuccessMessage}
        onClose={() => toggleSuccessMessage(false)}
      />
    </div>
  )
}
