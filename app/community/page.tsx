"use client"

import { Header } from "@/components/header"
import { useState } from "react"
import { useAppContext } from "@/context/app-context"

export default function CommunityPage() {
  const { addGems, toggleSuccessMessage } = useAppContext()
  const [activeTab, setActiveTab] = useState("trending")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  
  const posts = [
    {
      id: "p1",
      title: "How to spot phishing emails?",
      content: "I've been receiving some suspicious emails lately claiming to be from my bank. What are some key signs to look for to identify phishing attempts?",
      author: {
        name: "Alex Morgan",
        avatar: "green",
        role: "Student"
      },
      likes: 42,
      comments: 15,
      time: "2 hours ago",
      tags: ["Fraud", "Security"]
    },
    {
      id: "p2",
      title: "Best budgeting apps for students?",
      content: "I'm looking for a good budgeting app that's free or low-cost and works well for college students. Any recommendations from the community?",
      author: {
        name: "Jamie Taylor",
        avatar: "blue",
        role: "Student"
      },
      likes: 38,
      comments: 23,
      time: "5 hours ago",
      tags: ["Budgeting", "Apps"]
    },
    {
      id: "p3",
      title: "How I saved $500 this semester",
      content: "I wanted to share some strategies that helped me save $500 this semester while still enjoying college life. It's all about prioritizing expenses and finding creative alternatives.",
      author: {
        name: "Ryan Kim",
        avatar: "purple",
        role: "Student"
      },
      likes: 76,
      comments: 31,
      time: "1 day ago",
      tags: ["Saving", "Success Story"]
    }
  ]
  
  const handleLikePost = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
      addGems(2)
    }
  }
  
  const handleOpenComments = (post: any) => {
    setCurrentPost(post)
    setShowCommentModal(true)
  }
  
  const handleSubmitComment = () => {
    setShowCommentModal(false)
    addGems(5)
    toggleSuccessMessage(true)
  }
  
  const handleSubmitPost = () => {
    setShowNewPostModal(false)
    addGems(10)
    toggleSuccessMessage(true)
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black/90 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />\
