"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LearnPage() {
  const [userLessons, setUserLessons] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch lessons and user progress from backend
  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${API_URL}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserLessons(response.data.data || [])
      } catch (err) {
        setError("Failed to load lessons. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchLessons()
  }, [])

  const completedCount = userLessons.filter((l) => l.completed).length
  const progress = userLessons.length > 0 ? (completedCount / userLessons.length) * 100 : 0

  function handleOpenLesson(id: number) {
    setSelectedLesson(id)
    setShowLessonModal(true)
    setLessonCompleted(userLessons.find((l) => l.id === id)?.completed ?? false)
  }

  async function handleCompleteLesson(id: number) {
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${API_URL}/lessons/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserLessons((prev) =>
        prev.map((l) => (l.id === id ? { ...l, completed: true } : l))
      )
      setLessonCompleted(true)
      setTimeout(() => {
        setShowLessonModal(false)
      }, 800)
    } catch {
      setError("Failed to mark lesson as complete.")
    }
  }

  function handleCloseModal() {
    setShowLessonModal(false)
    setLessonCompleted(false)
  }

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black/90 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />

        <main className="container py-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-cyber-primary cyber-glow">Learn & Level Up</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Progress:</span>
              <Progress value={progress} className="w-40 h-2 bg-cyber-primary/10" />
              <span className="text-cyber-primary font-bold">{completedCount}/{userLessons.length}</span>
            </div>
          </div>

          {loading && <div>Loading lessons...</div>}
          {error && <div className="text-red-500">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLessons.map((lesson) => (
              <Card key={lesson.id} className="bg-black/60 border-cyber-primary/20 shadow-lg cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {lesson.title}
                    {lesson.completed && (
                      <Badge className="bg-cyber-primary text-black ml-2">Completed</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{lesson.description}</p>
                  <Button
                    variant="outline"
                    className="border-cyber-primary text-cyber-primary hover:bg-cyber-primary/10"
                    disabled={lesson.completed}
                    onClick={() => handleOpenLesson(lesson.id)}
                  >
                    {lesson.completed ? "Completed" : "Start Lesson"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        {/* Lesson Modal */}
        {showLessonModal && selectedLesson !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-black border border-cyber-primary/30 rounded-lg shadow-xl p-8 w-full max-w-lg relative cyber-card">
              <button
                className="absolute top-3 right-3 text-cyber-primary hover:text-cyber-secondary"
                onClick={handleCloseModal}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-cyber-primary mb-2">
                {userLessons.find((l) => l.id === selectedLesson)?.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {userLessons.find((l) => l.id === selectedLesson)?.description}
              </p>
              {!lessonCompleted ? (
                <Button
                  className="bg-cyber-primary text-black font-bold"
                  onClick={() => handleCompleteLesson(selectedLesson)}
                >
                  Mark as Complete
                </Button>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-green-400 font-bold text-lg mb-2">Lesson Completed!</span>
                  <Button
                    variant="outline"
                    className="border-cyber-primary text-cyber-primary mt-2"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

