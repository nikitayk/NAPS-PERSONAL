"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type User = {
  name: string
  gems: number
  streak: number
  progress: {
    budgeting: number
    fraud: number
    overall: number
  }
  completedLessons: string[]
  avatar: string
}

type Transaction = {
  id: string
  merchant: string
  amount: number
  date: string
  time: string
  isFraudulent: boolean
  category: string
}

type Challenge = {
  id: string
  title: string
  description: string
  reward: number
  completed: boolean
  type: "fraud" | "budget" | "savings"
}

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  date: string
}

interface AppContextType {
  user: User
  transactions: Transaction[]
  challenges: Challenge[]
  notifications: Notification[]
  selectedTransaction: string | null
  showFraudAlert: boolean
  showSuccessMessage: boolean
  currentLesson: string | null
  isMenuOpen: boolean
  isDarkMode: boolean
  isLoading: boolean

  // Actions
  addGems: (amount: number) => void
  incrementStreak: () => void
  completeLesson: (lessonId: string) => void
  selectTransaction: (id: string | null) => void
  markNotificationAsRead: (id: string) => void
  toggleFraudAlert: (show: boolean) => void
  toggleSuccessMessage: (show: boolean) => void
  setCurrentLesson: (lessonId: string | null) => void
  toggleMenu: () => void
  toggleDarkMode: () => void
  setLoading: (loading: boolean) => void
  checkFraudulentTransaction: (id: string) => boolean
}

const defaultUser: User = {
  name: "User",
  gems: 245,
  streak: 7,
  progress: {
    budgeting: 60,
    fraud: 25,
    overall: 42,
  },
  completedLessons: ["intro-budgeting", "create-budget", "track-expenses", "budget-tools"],
  avatar: "JS",
}

const defaultTransactions: Transaction[] = [
  {
    id: "t1",
    merchant: "Coffee Shop",
    amount: 4.5,
    date: "May 15, 2023",
    time: "9:30 AM",
    isFraudulent: false,
    category: "food",
  },
  {
    id: "t2",
    merchant: "Amazon",
    amount: 29.99,
    date: "May 15, 2023",
    time: "2:15 PM",
    isFraudulent: false,
    category: "shopping",
  },
  {
    id: "t3",
    merchant: "International Transfer",
    amount: 199.99,
    date: "May 15, 2023",
    time: "3:42 AM",
    isFraudulent: true,
    category: "transfer",
  },
]

const defaultChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Spot the Fraud",
    description: "Identify which transaction might be fraudulent",
    reward: 20,
    completed: false,
    type: "fraud",
  },
  {
    id: "c2",
    title: "Budget Challenge",
    description: "Create a monthly budget with limited resources",
    reward: 30,
    completed: false,
    type: "budget",
  },
  {
    id: "c3",
    title: "Savings Goal",
    description: "Plan how to reach a savings target",
    reward: 25,
    completed: false,
    type: "savings",
  },
]

const defaultNotifications: Notification[] = [
  {
    id: "n1",
    title: "New Challenge Available",
    message: "Complete today's fraud detection challenge to earn 20 gems!",
    read: false,
    date: "1 hour ago",
  },
  {
    id: "n2",
    title: "Streak Reminder",
    message: "Don't forget to complete a lesson today to maintain your 7-day streak!",
    read: true,
    date: "5 hours ago",
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions)
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showFraudAlert, setShowFraudAlert] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const addGems = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      gems: prev.gems + amount,
    }))
  }

  const incrementStreak = () => {
    setUser((prev) => ({
      ...prev,
      streak: prev.streak + 1,
    }))
  }

  const completeLesson = (lessonId: string) => {
    if (!user.completedLessons.includes(lessonId)) {
      setUser((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      }))
    }
  }

  const selectTransaction = (id: string | null) => {
    setSelectedTransaction(id)
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const toggleFraudAlert = (show: boolean) => {
    setShowFraudAlert(show)
  }

  const toggleSuccessMessage = (show: boolean) => {
    setShowSuccessMessage(show)
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const checkFraudulentTransaction = (id: string): boolean => {
    const transaction = transactions.find((t) => t.id === id)
    return transaction?.isFraudulent || false
  }

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        challenges,
        notifications,
        selectedTransaction,
        showFraudAlert,
        showSuccessMessage,
        currentLesson,
        isMenuOpen,
        isDarkMode,
        isLoading,

        // Actions
        addGems,
        incrementStreak,
        completeLesson,
        selectTransaction,
        markNotificationAsRead,
        toggleFraudAlert,
        toggleSuccessMessage,
        setCurrentLesson,
        toggleMenu,
        toggleDarkMode,
        setLoading,
        checkFraudulentTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
