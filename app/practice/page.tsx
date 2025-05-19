"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Notification } from "@/components/notification"
import { useAppContext } from "@/context/app-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Type definitions (adjust as needed)
type Transaction = {
  id: string
  merchant: string
  amount: number
  date: string
}

type Scenario = {
  id: string
  title: string
  description: string
  situation: string
  options: any[]
  reward: number
  difficulty: string
  tags: string[]
  available: boolean
  completed?: boolean
}

type Quiz = {
  id: string
  title: string
  description: string
  questions: any[]
  timeLimit: string
  reward: number
  tags: string[]
  available: boolean
  completed?: boolean
}

export default function PracticePage() {
  const { transactions, addGems, toggleSuccessMessage } = useAppContext()
  const [activeTab, setActiveTab] = useState("daily")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showFraudModal, setShowFraudModal] = useState(false)
  const [showScenarioModal, setShowScenarioModal] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Fetch practice data from backend
  useEffect(() => {
    const fetchPracticeData = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const [scenariosRes, quizzesRes] = await Promise.all([
          axios.get(`${API_URL}/practice/scenarios`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/practice/quizzes`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ])
        setScenarios(scenariosRes.data?.data || [])
        setQuizzes(quizzesRes.data?.data || [])
      } catch (err) {
        setError("Failed to load practice data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchPracticeData()
  }, [])

  const handleTransactionSelect = (id: string) => {
    setSelectedTransaction(id)
    setShowFraudModal(true)
  }

  const handleCheckAnswer = async (isFraud: boolean) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${API_URL}/practice/complete-challenge`, {
        transactionId: selectedTransaction,
        isFraud
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      addGems(20)
      setNotificationMessage("Challenge completed! You earned 20 gems.")
      setShowSuccessMessage(true)
      toggleSuccessMessage(true)
    } catch (err) {
      setError("Failed to submit challenge. Please try again.")
    }
    setShowFraudModal(false)
  }

  const handleStartScenario = (scenario: Scenario) => {
    if (!scenario.available) return
    setCurrentScenario(scenario)
    setShowScenarioModal(true)
  }

  const handleScenarioAnswer = async (optionId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URL}/practice/submit-scenario`, {
        scenarioId: currentScenario?.id,
        optionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        addGems(response.data.reward)
        setNotificationMessage(`Scenario completed! You earned ${response.data.reward} gems.`)
        setShowSuccessMessage(true)
        toggleSuccessMessage(true)
      }
    } catch (err) {
      setError("Failed to submit scenario answer.")
    }
    setShowScenarioModal(false)
  }

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setShowQuizModal(true)
  }

  const handleQuizSubmission = async (answers: any) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URL}/practice/complete-quiz`, {
        quizId: currentQuiz?.id,
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        addGems(response.data.reward)
        setNotificationMessage(`Quiz completed! You earned ${response.data.reward} gems.`)
        setShowSuccessMessage(true)
        toggleSuccessMessage(true)
      }
    } catch (err) {
      setError("Failed to submit quiz. Please try again.")
    }
    setShowQuizModal(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black/90 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />

        <main className="container py-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 cyber-glow">Practice Your Skills</h1>
            <p className="text-muted-foreground">
              Apply what you've learned through interactive challenges and real-world scenarios.
            </p>
          </motion.div>

          {loading && (
            <div className="text-center py-8">
              <div className="cyber-loader animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading practice modules...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <Tabs defaultValue="daily" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-cyber-dark border border-cyber-primary/20">
              <TabsTrigger value="daily" className="cyber-tab">
                <Shield className="w-4 h-4 mr-2" />
                Daily Challenge
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="cyber-tab">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Scenarios
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="cyber-tab">
                <TrendingUp className="w-4 h-4 mr-2" />
                Quizzes
              </TabsTrigger>
            </TabsList>

            {/* Daily Challenge Tab */}
            <TabsContent value="daily" className="space-y-8">
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "daily" ? "visible" : "hidden"}
              >
                {transactions.map((transaction: Transaction, index: number) => (
                  <motion.div
                    key={transaction.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="cyber-card border-cyber-primary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-4">
                          <CreditCard className="h-6 w-6 text-cyber-primary" />
                          {transaction.merchant}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Amount: ${transaction.amount}
                          <br />
                          Date: {transaction.date}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-end">
                        <Button
                          className="cyber-button text-black"
                          onClick={() => handleTransactionSelect(transaction.id)}
                        >
                          Analyze Transaction
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Scenarios Tab */}
            <TabsContent value="scenarios" className="space-y-6">
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "scenarios" ? "visible" : "hidden"}
              >
                {scenarios.map((scenario: Scenario, index: number) => (
                  <motion.div
                    key={scenario.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5 }}
                  >
                    <Card className={`cyber-card border-cyber-primary/30 ${!scenario.available ? "opacity-70" : ""}`}>
                      <CardHeader>
                        <CardTitle>{scenario.title}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button
                          disabled={!scenario.available}
                          onClick={() => handleStartScenario(scenario)}
                        >
                          Start Scenario
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-6">
              <motion.div
                className="grid md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "quizzes" ? "visible" : "hidden"}
              >
                {quizzes.map((quiz: Quiz, index: number) => (
                  <motion.div
                    key={quiz.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="cyber-card border-cyber-primary/30 h-full">
                      <CardHeader>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button
                          disabled={!quiz.available}
                          onClick={() => handleStartQuiz(quiz)}
                        >
                          Start Quiz
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Fraud Detection Modal */}
        <Modal
          isOpen={showFraudModal}
          onClose={() => setShowFraudModal(false)}
          title="Fraud Detection Challenge"
        >
          <div>
            {/* Replace with your modal content */}
            <p>Is this transaction fraudulent?</p>
            <Button onClick={() => handleCheckAnswer(true)}>Yes, it's fraud</Button>
            <Button onClick={() => handleCheckAnswer(false)}>No, it's legitimate</Button>
          </div>
        </Modal>

        {/* Scenario Modal */}
        <Modal
          isOpen={showScenarioModal}
          onClose={() => setShowScenarioModal(false)}
          title={currentScenario?.title || "Scenario"}
        >
          <div>
            {currentScenario ? (
              <>
                <p>{currentScenario.situation}</p>
                <div>
                  {currentScenario.options.map((option: any) => (
                    <Button
                      key={option.id}
                      onClick={() => handleScenarioAnswer(option.id)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p>No scenario selected.</p>
            )}
          </div>
        </Modal>

        {/* Quiz Modal */}
        <Modal
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          title={currentQuiz?.title || "Quiz"}
        >
          <div>
            {currentQuiz ? (
              <>
                {/* Render quiz questions here */}
                <p>Quiz questions go here.</p>
                {/* You can add your quiz logic */}
              </>
            ) : (
              <p>No quiz selected.</p>
            )}
          </div>
        </Modal>

        <Notification
          title="Success"
          message={notificationMessage}
          type="success"
          onClose={() => setShowSuccessMessage(false)}
          show={showSuccessMessage}
        />
      </div>
    </div>
  )
}
