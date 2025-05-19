"use client"

import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAppContext } from "@/context/app-context"

// Get API base URL from .env
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function CommunityPage() {
  const { addGems, toggleSuccessMessage } = useAppContext()
  const [activeTab, setActiveTab] = useState("trending")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch posts from backend on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${API_URL}/forums`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPosts(response.data.data || [])
      } catch (err: any) {
        setError("Failed to load posts. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Like/unlike a post
  const handleLikePost = async (postId: string) => {
    const token = localStorage.getItem("token")
    try {
      if (likedPosts.includes(postId)) {
        // Unlike (optional, if your backend supports it)
        await axios.delete(`${API_URL}/forums/${postId}/like`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setLikedPosts(likedPosts.filter(id => id !== postId))
      } else {
        await axios.post(`${API_URL}/forums/${postId}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setLikedPosts([...likedPosts, postId])
        addGems(2)
      }
    } catch (err) {
      setError("Error updating like. Please try again.")
    }
  }

  // Open comment modal
  const handleOpenComments = (post: any) => {
    setCurrentPost(post)
    setShowCommentModal(true)
  }

  // Submit a comment
  const handleSubmitComment = async (commentText: string) => {
    const token = localStorage.getItem("token")
    try {
      await axios.post(`${API_URL}/forums/${currentPost.id}/comments`, 
        { content: commentText }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowCommentModal(false)
      addGems(5)
      toggleSuccessMessage(true)
      // Optionally, refresh posts/comments
    } catch (err) {
      setError("Failed to submit comment.")
    }
  }

  // Submit a new post
  const handleSubmitPost = async (title: string, content: string, tags: string[]) => {
    const token = localStorage.getItem("token")
    try {
      await axios.post(`${API_URL}/forums`, 
        { title, content, tags }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowNewPostModal(false)
      addGems(10)
      toggleSuccessMessage(true)
      // Optionally, refresh posts
    } catch (err) {
      setError("Failed to submit post.")
    }
  }

  // UI rendering
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-black/90 pointer-events-none"></div>
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto py-8">
          {loading && <div>Loading posts...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {/* Render posts */}
          {posts.map(post => (
            <div key={post.id} className="mb-6 bg-gray-800 p-4 rounded">
              <h2 className="text-lg font-bold">{post.title}</h2>
              <p>{post.content}</p>
              <div className="flex items-center mt-2">
                <button
                  className={`mr-2 ${likedPosts.includes(post.id) ? "text-blue-400" : "text-gray-400"}`}
                  onClick={() => handleLikePost(post.id)}
                >
                  👍 {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </button>
                <button
                  className="text-gray-400"
                  onClick={() => handleOpenComments(post)}
                >
                  💬 {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Modals for new post and comments would go here */}
      </div>
    </div>
  )
}

