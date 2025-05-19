"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// --- Type Definitions ---
// Adjust these to match your backend data shape

export interface User {
  id: string
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
  // Add any other fields your backend returns
}

export interface Transaction {
  id: string
  merchant: string
  amount: number
  date: string
  time?: string
  isFraudulent?: boolean
  category?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  reward: number
  completed: boolean
  type: "fraud" | "budget" | "savings"
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  date: string
}

// Define the context type
export interface AppContextType {
  user: User | null
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

// --- Context Implementation ---

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showFraudAlert, setShowFraudAlert] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user, transactions, challenges, notifications from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) {
          setIsLoading(false)
          return
        }
        const [userRes, txRes, chRes, notifRes] = await Promise.all([
          axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/challenges`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setUser(userRes.data.data)
        setTransactions(txRes.data.data || [])
        setChallenges(chRes.data.data || [])
        setNotifications(notifRes.data.data || [])
      } catch (err) {
        // Optionally, set error state here
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Add gems and sync with backend
  const addGems = useCallback(async (amount: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token || !user) return
    try {
      const res = await axios.post(
        `${API_URL}/users/add-gems`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(res.data.data)
    } catch {
      // Optionally, set error state here
    }
  }, [user])

  // Increment streak and sync with backend
  const incrementStreak = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token || !user) return
    try {
      const res = await axios.post(
        `${API_URL}/users/increment-streak`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(res.data.data)
    } catch {
      // Optionally, set error state here
    }
  }, [user])

  // Complete lesson and sync with backend
  const completeLesson = useCallback(async (lessonId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token || !user) return
    try {
      const res = await axios.post(
        `${API_URL}/lessons/${lessonId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(res.data.data)
    } catch {
      // Optionally, set error state here
    }
  }, [user])

  // Select transaction (UI only)
  const selectTransaction = (id: string | null) => {
    setSelectedTransaction(id)
  }

  // Mark notification as read and sync with backend
  const markNotificationAsRead = useCallback(async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    try {
      await axios.post(
        `${API_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
      )
    } catch {
      // Optionally, set error state here
    }
  }, [])

  // UI toggles (as before)
  const toggleFraudAlert = (show: boolean) => setShowFraudAlert(show)
  const toggleSuccessMessage = (show: boolean) => setShowSuccessMessage(show)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)
  const setLoading = (loading: boolean) => setIsLoading(loading)

  // Fraud check (can be moved to backend for more security)
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

