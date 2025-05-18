"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"

const lessons = [
  {
    id: 1,
    title: "What is Financial Literacy?",
    description: "Learn the basics of managing money, saving, and investing.",
    completed: false,
  },
  {
    id: 2,
    title: "Recognizing Online Scams",
    description: "Identify common online fraud tactics and how to avoid them.",
    completed: false,
  },
  {
    id: 3,
    title: "Smart Budgeting",
    description: "Create and manage a budget to achieve your financial goals.",
    completed: false,
  },
  {
    id: 4,
    title: "Safe Digital Payments",
    description: "Learn how to use UPI, cards, and wallets securely.",
    completed: false,
  },
]

export default function LearnPage() {
  const [userLessons, setUserLessons] = useState(lessons)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)

  const completedCount = userLessons.filter((l) => l.completed).length
  const progress = (completedCount / userLessons.length) * 100

  function handleOpenLesson(id: number) {
    setSelectedLesson(id)
    setShowLessonModal(true)
    setLessonCompleted(userLessons.find((l) => l.id === id)?.completed ?? false)
  }

  function handleCompleteLesson(id: number) {
    setUserLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, completed: true } : l))
    )
    setLessonCompleted(true)
    setTimeout(() => {
      setShowLessonModal(false)
    }, 800)
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
