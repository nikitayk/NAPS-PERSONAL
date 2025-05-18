"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText } from "lucide-react"
import { useState } from "react"
import { useAppContext } from "@/context/app-context"

export default function LearnPage() {
  const { user, completeLesson, addGems, toggleSuccessMessage } = useAppContext()
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const lessons = [
    {
      id: "intro-budgeting",
      title: "Introduction to Budgeting",
      description: "Learn why budgeting is important and how it can help you achieve your financial goals.",
      type: "Video",
      icon: Video,
      duration: "10 min",
      completed: user.completedLessons.includes("intro-budgeting"),
      locked: false,
      content:
        "Budgeting is the process of creating a plan for how you will spend your money. This spending plan is called a budget. Creating this plan allows you to determine in advance whether you will have enough money to do the things you need to do or would like to do. If you don't have enough money to do everything you would like to do, then you can use this planning process to prioritize your spending and focus your money on the things that are most important to you.",
    },
    {
      id: "create-budget",
      title: "Creating Your First Budget",
      description: "Step-by-step guide to creating a personalized budget that works for your income and lifestyle.",
      type: "Article",
      icon: FileText,
      duration: "15 min",
      completed: user.completedLessons.includes("create-budget"),
      locked: false,
      content:
        "Creating a budget is easier than you might think. Start by tracking your income and expenses for a month to get a clear picture of your financial situation. Then, categorize your expenses into fixed (rent, utilities) and variable (entertainment, dining out). Set realistic spending limits for each category based on your income and financial goals. Remember to include savings as a non-negotiable 'expense' in your budget. Review and adjust your budget regularly as your financial situation changes.",
    },
    {
      id: "track-expenses",
      title: "Tracking Expenses",
      description: "Learn different methods to track your expenses effectively and stay within your budget.",
      type: "Interactive",
      icon: BookOpen,
      duration: "20 min",
      completed: user.completedLessons.includes("track-expenses"),
      locked: false,
      content:
        "Tracking your expenses is crucial for maintaining a successful budget. You can use various methods such as spreadsheets, budgeting apps, or even a simple notebook. The key is consistency - record every expense, no matter how small. Categorize your spending to identify patterns and areas where you might be overspending. Review your expenses weekly to stay on track with your budget goals. Remember, tracking expenses isn't about restricting yourself, but about making informed financial decisions.",
    },
    {
      id: "budget-tools",
      title: "Budgeting Apps and Tools",
      description: "Explore digital tools that can help you manage your budget more efficiently.",
      type: "Video",
      icon: Video,
      duration: "12 min",
      completed: user.completedLessons.includes("budget-tools"),
      locked: false,
      content:
        "Modern technology offers numerous tools to simplify budgeting. Apps like Mint, YNAB (You Need A Budget), and Personal Capital can automatically track your spending, categorize expenses, and provide visual reports of your financial habits. Many banking apps now include budgeting features as well. Digital spreadsheet templates are available for those who prefer more manual control. Choose tools that match your preferences and financial goals, and don't be afraid to try different options until you find what works best for you.",
    },
    {
      id: "irregular-income",
      title: "Handling Irregular Income",
      description: "Strategies for budgeting when your income varies from month to month.",
      type: "Article",
      icon: FileText,
      duration: "18 min",
      completed: user.completedLessons.includes("irregular-income"),
      locked: false,
      content:
        "Budgeting with an irregular income presents unique challenges, but it's definitely manageable with the right approach. Start by calculating your average monthly income based on the past 6-12 months. Then, create a budget based on your lowest earning month to ensure you can always cover essential expenses. Prioritize your expenses into 'need to have' and 'nice to have' categories. During higher-income months, allocate extra earnings to an emergency fund or savings. Consider setting up a separate account where you deposit all income, then pay yourself a consistent 'salary' each month to create stability.",
    },
    {
      id: "emergency-funds",
      title: "Emergency Funds",
      description: "Learn how to build and maintain an emergency fund as part of your budget.",
      type: "Interactive",
      icon: BookOpen,
      duration: "25 min",
      completed: user.completedLessons.includes("emergency-funds"),
      locked: false,
      content:
        "An emergency fund is your financial safety net for unexpected expenses or income disruptions. Aim to save 3-6 months of essential expenses in a readily accessible account. Start small if necessary - even $500-$1000 can help with minor emergencies. Make regular contributions to your emergency fund as part of your budget, treating it as a non-negotiable expense. Keep this money separate from your regular savings to avoid the temptation to use it for non-emergencies. Once established, only tap into this fund for true emergencies like medical bills, car repairs, or job loss.",
    },
    {
      id: "adjust-budget",
      title: "Adjusting Your Budget",
      description: "How to review and adjust your budget as your financial situation changes.",
      type: "Video",
      icon: Video,
      duration: "15 min",
      completed: user.completedLessons.includes("adjust-budget"),
      locked: !user.completedLessons.includes("emergency-funds"),
      content:
        "Your budget should be a flexible tool that evolves with your life circumstances. Review your budget monthly to assess what's working and what isn't. Don't be discouraged if you need to make adjustments - this is a normal part of the budgeting process. When your income increases, avoid lifestyle inflation by allocating a portion to savings and financial goals before increasing discretionary spending. For major life changes like a new job, relocation, or family addition, completely reassess your budget to reflect your new financial reality.",
    },
    {
      id: "advanced-budgeting",
      title: "Advanced Budgeting Techniques",
      description: "Explore more sophisticated budgeting methods for long-term financial planning.",
      type: "Article",
      icon: FileText,
      duration: "22 min",
      completed: user.completedLessons.includes("advanced-budgeting"),
      locked: !user.completedLessons.includes("adjust-budget"),
      content:
        "Once you've mastered basic budgeting, consider exploring more sophisticated approaches. The zero-based budget ensures every dollar has a purpose, while the 50/30/20 method allocates 50% to needs, 30% to wants, and 20% to savings/debt. Value-based budgeting aligns spending with your personal values and priorities. Cash envelope systems can help control spending in problem categories. For couples, decide between joint, separate, or proportional budgeting based on your relationship dynamics. Whichever method you choose, the key is consistency and alignment with your long-term financial goals.",
    },
  ]

  const handleStartLesson = (lesson: any) => {
    if (lesson.locked) return

    setCurrentLesson(lesson)
    setShowLessonModal(true)
  }

  const handleCompleteLesson = () => {
    if (currentLesson && !currentLesson.completed) {
      completeLesson(currentLesson.id)
      addGems(10)
      setShowLessonModal(false)
      setShowCompletionModal(true)
    } else {
      setShowLessonModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black/90 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />

        <main className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-4 text-cyber-primary">Learning Paths</h2>
                <nav className="space-y-2">
                  {[
                    { name: "Budgeting Basics", active: true },
                    { name: "Fraud Prevention", active: false },
                    { name: "Investment 101", active: false },
                    { name: "Credit Building", active: false },
                    { name: "Debt Management", active: false },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant={item
