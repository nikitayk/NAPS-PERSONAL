"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, CreditCard, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { Modal } from "@/components/ui/modal"
import { Notification } from "@/components/notification"

export default function PracticePage() {
  const { transactions, addGems, toggleSuccessMessage } = useAppContext()
  const [activeTab, setActiveTab] = useState("daily")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showFraudModal, setShowFraudModal] = useState(false)
  const [showScenarioModal, setShowScenarioModal] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<any>(null)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)

  const scenarios = [
    {
      id: "s1",
      title: "Credit Card Fraud Alert",
      description: "You receive a text message about suspicious activity on your credit card. What should you do?",
      icon: AlertTriangle,
      difficulty: "Medium",
      reward: 30,
      available: true,
      content:
        "You receive the following text message: 'ALERT: Unusual activity detected on your credit card. $750 charge at Electronics Store. Reply YES to confirm or NO to decline.' The text is from an unknown number and asks you to click a link to verify your information.",
      options: [
        { id: "a", text: "Reply YES to confirm the transaction", correct: false },
        { id: "b", text: "Click the link and enter your card details to verify", correct: false },
        { id: "c", text: "Reply NO to decline the transaction", correct: false },
        { id: "d", text: "Ignore the text and call your bank directly using the number on your card", correct: true },
      ],
    },
    {
      id: "s2",
      title: "First Job Budgeting",
      description: "You just got your first job with a $3,000 monthly salary. Create a budget for your new income.",
      icon: DollarSign,
      difficulty: "Easy",
      reward: 25,
      available: true,
      content:
        "Congratulations on your first job! You'll be earning $3,000 per month after taxes. You need to create a budget that covers all your essential expenses while also saving for the future. Your monthly expenses include: $1,000 for rent, $200 for utilities, $300 for groceries, $150 for transportation, and $100 for phone/internet.",
      options: [
        { id: "a", text: "Spend $2,000 on essentials, $800 on entertainment, and save $200", correct: false },
        { id: "b", text: "Spend $1,750 on essentials, $750 on discretionary spending, and save $500", correct: true },
        {
          id: "c",
          text: "Spend $1,750 on essentials, $1,250 on discretionary spending, and save nothing",
          correct: false,
        },
        { id: "d", text: "Spend $2,500 on essentials and save $500", correct: false },
      ],
    },
    {
      id: "s3",
      title: "Investment Decision",
      description: "You have $5,000 to invest. Analyze different investment options and make a decision.",
      icon: TrendingUp,
      difficulty: "Hard",
      reward: 40,
      available: true,
      content:
        "You've saved $5,000 and want to start investing. You're 25 years old with a stable job and no high-interest debt. You already have a 3-month emergency fund. You're trying to decide the best way to invest this money for long-term growth.",
      options: [
        { id: "a", text: "Put all $5,000 in a high-yield savings account (2% APY)", correct: false },
        { id: "b", text: "Invest all $5,000 in a single hot tech stock", correct: false },
        { id: "c", text: "Invest $5,000 in a diversified index fund or ETF", correct: true },
        { id: "d", text: "Use $5,000 to buy cryptocurrency", correct: false },
      ],
    },
    {
      id: "s4",
      title: "Phishing Email Detection",
      description: "Review a series of emails and identify which ones are phishing attempts.",
      icon: Shield,
      difficulty: "Medium",
      reward: 35,
      available: false,
      content: "",
      options: [],
    },
  ]

  const quizzes = [
    {
      id: "q1",
      title: "Budgeting Basics",
      description: "Test your knowledge of budgeting fundamentals",
      questions: 10,
      timeLimit: "15 min",
      completed: true,
      score: "8/10",
    },
    {
      id: "q2",
      title: "Fraud Detection",
      description: "Identify common fraud schemes and prevention methods",
      questions: 12,
      timeLimit: "20 min",
      completed: false,
      score: null,
    },
    {
      id: "q3",
      title: "Credit Cards",
      description: "Understanding credit cards, interest rates, and fees",
      questions: 8,
      timeLimit: "12 min",
      completed: false,
      score: null,
    },
    {
      id: "q4",
      title: "Saving Strategies",
      description: "Test your knowledge of effective saving methods",
      questions: 10,
      timeLimit: "15 min",
      completed: false,
      score: null,
    },
    {
      id: "q5",
      title: "Investment Basics",
      description: "Fundamentals of investing and different investment types",
      questions: 15,
      timeLimit: "25 min",
      completed: false,
      score: null,
    },
    {
      id: "q6",
      title: "Financial Security",
      description: "Protecting your financial information and accounts",
      questions: 10,
      timeLimit: "15 min",
      completed: false,
      score: null,
    },
  ]

  const handleTransactionSelect = (id: string) => {
    setSelectedTransaction(id)
  }

  const handleCheckAnswer = () => {
    if (selectedTransaction === "t3") {
      addGems(20)
      toggleSuccessMessage(true)
    } else {
      // Show incorrect notification
    }
    setShowFraudModal(false)
  }

  const handleStartScenario = (scenario: any) => {
    if (!scenario.available) return

    setCurrentScenario(scenario)
    setShowScenarioModal(true)
  }

  const handleScenarioAnswer = (optionId: string) => {
    const isCorrect = currentScenario.options.find((o: any) => o.id === optionId)?.correct || false

    if (isCorrect) {
      addGems(currentScenario.reward)
      toggleSuccessMessage(true)
    }

    setShowScenarioModal(false)
  }

  const handleStartQuiz = (quiz: any) => {
    setCurrentQuiz(quiz)
    setShowQuizModal(true)
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
            <h1 className="text-3xl font-bold mb-2">Practice Your Skills</h1>
            <p className="text-muted-foreground">
              Apply what you've learned through interactive challenges and real-world scenarios.
            </p>
          </motion.div>

          <Tabs defaultValue="daily" className="w-full" onValueChange={setActiveTab}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger
                  value="daily"
                  className="data-[state=active]:bg-cyber-primary/20 data-[state=active]:text-cyber-primary"
                >
                  Daily Challenges
                </TabsTrigger>
                <TabsTrigger
                  value="scenarios"
                  className="data-[state=active]:bg-cyber-primary/20 data-[state=active]:text-cyber-primary"
                >
                  Real-World Scenarios
                </TabsTrigger>
                <TabsTrigger
                  value="quizzes"
                  className="data-[state=active]:bg-cyber-primary/20 data-[state=active]:text-cyber-primary"
                >
                  Knowledge Quizzes
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="daily" className="space-y-8">
              <motion.div
                className="bg-cyber-primary/5 border border-cyber-primary/20 rounded-xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="absolute inset-0 cyber-grid opacity-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-cyber-primary">Today's Challenge</h2>
                    <Badge className="bg-cyber-primary text-black">+20 💎</Badge>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Complete daily challenges to earn gems and build your streak!
                  </p>

                  <Card className="cyber-card border-cyber-primary/30">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-12 h-12 rounded-full bg-cyber-primary/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 170, 0.2)" }}
                        >
                          <Shield className="h-6 w-6 text-cyber-primary" />
                        </motion.div>
                        <div>
                          <CardTitle>Spot the Fraud</CardTitle>
                          <CardDescription>Identify which transaction might be fraudulent</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <motion.div
                            key={transaction.id}
                            className={`p-4 border ${
                              selectedTransaction === transaction.id ? "border-cyber-primary" : "border-muted/20"
                            } rounded-md hover:border-cyber-primary/30 transition-colors cursor-pointer`}
                            whileHover={{
                              scale: 1.02,
                              boxShadow: "0 0 10px rgba(0, 255, 170, 0.2)",
                            }}
                            whileTap={{ scale: 0.98 }}
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
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full cyber-button text-black group relative overflow-hidden"
                        onClick={() => setShowFraudModal(true)}
                        disabled={!selectedTransaction}
                      >
                        <span className="relative z-10">Check Answer</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                  <Card className="cyber-card border-cyber-primary/30 h-full">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 170, 0.2)" }}
                        >
                          <CreditCard className="h-5 w-5 text-cyber-primary" />
                        </motion.div>
                        <div>
                          <CardTitle>Budget Challenge</CardTitle>
                          <CardDescription>Create a monthly budget with limited resources</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        You have $1,500 for the month. Allocate your funds to different categories to create a balanced
                        budget.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-muted/20 text-muted-foreground hover:bg-muted/30">
                        Available Tomorrow
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                  <Card className="cyber-card border-cyber-primary/30 h-full">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-10 h-10 rounded-full bg-cyber-primary/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 170, 0.2)" }}
                        >
                          <DollarSign className="h-5 w-5 text-cyber-primary" />
                        </motion.div>
                        <div>
                          <CardTitle>Savings Goal</CardTitle>
                          <CardDescription>Plan how to reach a savings target</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        You want to save $2,000 for a vacation in 6 months. Create a savings plan to reach your goal.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-muted/20 text-muted-foreground hover:bg-muted/30">
                        Available in 2 Days
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "scenarios" ? "visible" : "hidden"}
              >
                {scenarios.map((scenario, index) => (
                  <motion.div key={scenario.id} variants={itemVariants} custom={index} whileHover={{ y: -5 }}>
                    <Card className={`cyber-card border-cyber-primary/30 ${!scenario.available ? "opacity-70" : ""}`}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-cyber-primary/10 flex items-center justify-center"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 170, 0.2)" }}
                          >
                            <scenario.icon className="h-6 w-6 text-cyber-primary" />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <CardTitle>{scenario.title}</CardTitle>
                              <Badge className="bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30">
                                +{scenario.reward} 💎
                              </Badge>
                            </div>
                            <CardDescription className="mt-1">{scenario.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <Badge className="bg-muted/20 text-muted-foreground">{scenario.difficulty} Difficulty</Badge>
                        <Button
                          className={
                            scenario.available
                              ? "cyber-button text-black group relative overflow-hidden"
                              : "bg-muted/20 text-muted-foreground cursor-not-allowed"
                          }
                          disabled={!scenario.available}
                          onClick={() => handleStartScenario(scenario)}
                        >
                          <span className="relative z-10">{scenario.available ? "Start Scenario" : "Locked"}</span>
                          {scenario.available && (
                            <span className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-6">
              <motion.div
                className="grid md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "quizzes" ? "visible" : "hidden"}
              >
                {quizzes.map((quiz, index) => (
                  <motion.div key={index} variants={itemVariants} custom={index} whileHover={{ y: -5 }}>
                    <Card
                      className={`cyber-card border-cyber-primary/30 h-full ${
                        quiz.completed ? "border-l-4 border-l-cyber-primary" : ""
                      }`}
                    >
                      <CardHeader>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{quiz.questions} Questions</span>
                          <span>{quiz.timeLimit}</span>
                        </div>
                        {quiz.completed && (
                          <div className="mt-2 p-2 bg-cyber-primary/10 rounded text-center">
                            <span className="text-cyber-primary font-medium">Score: {quiz.score}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          className={
                            quiz.completed
                              ? "bg-cyber-primary/20 text-cyber-primary hover:bg-cyber-primary/30 w-full"
                              : "cyber-button text-black w-full group relative overflow-hidden"
                          }
                          onClick={() => handleStartQuiz(quiz)}
                        >
                          <span className="relative z-10">{quiz.completed ? "Retake Quiz" : "Start Quiz"}</span>
                          {!quiz.completed && (
                            <span className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Fraud Modal */}
      <Modal title="Fraud Detection Challenge" isOpen={showFraudModal} onClose={() => setShowFraudModal(false)}>
        <div className="space-y-4">
          <p className="text-muted-foreground">Are you sure you want to select this transaction as fraudulent?</p>

          {selectedTransaction && (
            <div className="p-4 border border-cyber-primary/20 rounded-md bg-cyber-primary/5">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{transactions.find((t) => t.id === selectedTransaction)?.merchant}</h4>
                  <p className="text-sm text-muted-foreground">
                    {transactions.find((t) => t.id === selectedTransaction)?.date} -
                    {transactions.find((t) => t.id === selectedTransaction)?.time}
                  </p>
                </div>
                <div className="text-right font-medium">
                  ${transactions.find((t) => t.id === selectedTransaction)?.amount.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowFraudModal(false)}>
              Cancel
            </Button>
            <Button className="cyber-button text-black" onClick={handleCheckAnswer}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Scenario Modal */}
      <Modal
        title={currentScenario?.title || "Scenario"}
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        className="max-w-2xl"
      >
        {currentScenario && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Badge className="bg-muted/20 text-muted-foreground">{currentScenario.difficulty} Difficulty</Badge>
              <Badge className="bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30">
                +{currentScenario.reward} 💎 Reward
              </Badge>
            </div>

            <div className="p-4 border border-cyber-primary/20 rounded-md bg-cyber-primary/5">
              <p>{currentScenario.content}</p>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="font-medium">What would you do?</h3>
              {currentScenario.options.map((option: any) => (
                <motion.div
                  key={option.id}
                  className="p-3 border border-cyber-primary/20 rounded-md hover:border-cyber-primary hover:bg-cyber-primary/5 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleScenarioAnswer(option.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full border border-cyber-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {option.id.toUpperCase()}
                    </div>
                    <p>{option.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Quiz Modal */}
      <Modal
        title={currentQuiz?.title || "Quiz"}
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        className="max-w-2xl"
      >
        {currentQuiz && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{currentQuiz.questions} Questions</span>
              <span>{currentQuiz.timeLimit}</span>
            </div>

            <div className="p-6 border border-cyber-primary/20 rounded-md bg-cyber-primary/5 text-center">
              <h3 className="text-lg font-medium mb-4">Ready to start the quiz?</h3>
              <p className="text-muted-foreground mb-6">
                Test your knowledge about {currentQuiz.title.toLowerCase()} and earn gems for correct answers.
              </p>

              <Button
                className="cyber-button text-black"
                onClick={() => {
                  setShowQuizModal(false)
                  addGems(15)
                  toggleSuccessMessage(true)
                }}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notifications */}
      <Notification
        title="Challenge Completed!"
        message="Congratulations! You've earned gems for completing the challenge."
        type="success"
        show={false}
        onClose={() => {}}
      />
    </div>
  )
}
