import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Flag,
  Eye,
  Clock,
  User,
  Pin,
  Lock,
  Edit,
  Trash2,
  Reply,
  Send,
  Loader2,
  AlertCircle,
  Heart,
  Bookmark
} from 'lucide-react';

interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  parentReply?: string;
  replies?: Reply[];
}

interface ForumThread {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    reputation?: number;
  };
  category: string;
  tags: string[];
  views: number;
  likes: number;
  dislikes: number;
  replies: Reply[];
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  isFollowing?: boolean;
  isSaved?: boolean;
}

const API_BASE_URL = 'http://localhost:5000/api';

interface ForumThreadProps {
  threadId?: string;
}

export default function ForumThread({ threadId = '1' }: ForumThreadProps) {
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  // Fetch thread data
  const fetchThread = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Fetch thread details
      const response = await fetch(`${API_BASE_URL}/forum/posts/${threadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch thread');
      }

      const data = await response.json();
      setThread(data.post || data);
      
      // Increment view count
      await fetch(`${API_BASE_URL}/forum/posts/${threadId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch thread');
      console.error('Error fetching thread:', err);
    } finally {
      setLoading(false);
    }
  };

  // Like/Unlike thread
  const toggleThreadLike = async (isLike: boolean) => {
    if (!thread) return;
    
    try {
      const token = getAuthToken();
      const endpoint = isLike ? 'like' : 'dislike';
      
      const response = await fetch(`${API_BASE_URL}/forum/posts/${threadId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} thread`);
      }

      // Update local state
      setThread(prev => prev ? {
        ...prev,
        likes: isLike ? prev.likes + 1 : prev.likes,
        dislikes: !isLike ? prev.dislikes + 1 : prev.dislikes
      } : null);
    } catch (err) {
      console.error(`Error ${isLike ? 'liking' : 'disliking'} thread:`, err);
    }
  };

  // Submit reply
  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !thread) return;

    try {
      setIsSubmittingReply(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/forum/posts/${threadId}/replies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyContent,
          parentReply: replyingTo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      const newReply = await response.json();
      
      // Add new reply to thread
      setThread(prev => prev ? {
        ...prev,
        replies: [...prev.replies, newReply.reply || newReply]
      } : null);

      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Like/Unlike reply
  const toggleReplyLike = async (replyId: string, isLike: boolean) => {
    if (!thread) return;
    
    try {
      const token = getAuthToken();
      const endpoint = isLike ? 'like' : 'dislike';
      
      const response = await fetch(`${API_BASE_URL}/forum/replies/${replyId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} reply`);
      }

      // Update local state
      setThread(prev => prev ? {
        ...prev,
        replies: prev.replies.map(reply => 
          reply._id === replyId 
            ? {
                ...reply,
                likes: isLike ? reply.likes + 1 : reply.likes,
                dislikes: !isLike ? reply.dislikes + 1 : reply.dislikes
              }
            : reply
        )
      } : null);
    } catch (err) {
      console.error(`Error ${isLike ? 'liking' : 'disliking'} reply:`, err);
    }
  };

  // Toggle reply expansion
  const toggleReplyExpansion = (replyId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchThread();
  }, [threadId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const currentUser = getCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading thread...</span>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Thread not found</h3>
        <p className="text-red-700 mb-4">{error || 'The requested thread could not be found.'}</p>
        <button 
          onClick={fetchThread}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </button>

      {/* Thread Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {thread.isPinned && (
                <Pin className="h-4 w-4 text-blue-600" />
              )}
              {thread.isLocked && (
                <Lock className="h-4 w-4 text-gray-600" />
              )}
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {thread.category}
              </span>
              {thread.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{thread.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {thread.author.name}
                {thread.author.reputation && (
                  <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">
                    {thread.author.reputation} rep
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDate(thread.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {thread.views} views
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {thread.replies.length} replies
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600">
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Thread Content */}
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
        </div>
        
        {/* Thread Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleThreadLike(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              {thread.likes}
            </button>
            <button
              onClick={() => toggleThreadLike(false)}
              className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <ThumbsDown className="h-4 w-4" />
              {thread.dislikes}
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Reply className="h-4 w-4" />
              Reply
            </button>
          </div>
          
          {currentUser && currentUser._id === thread.author._id && (
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {!thread.isLocked && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {replyingTo ? 'Reply to comment' : 'Add a reply'}
          </h3>
          
          <form onSubmit={submitReply}>
            <div className="mb-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSubmittingReply}
              />
            </div>
            
            <div className="flex items-center justify-between">
              {replyingTo && (
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel Reply
                </button>
              )}
              
              <button
                type="submit"
                disabled={!replyContent.trim() || isSubmittingReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingReply ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmittingReply ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Replies ({thread.replies.length})
        </h3>
        
        {thread.replies.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No replies yet</h4>
            <p className="text-gray-600">Be the first to reply to this thread!</p>
          </div>
        ) : (
          thread.replies.map((reply) => (
            <div key={reply._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{reply.author.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(reply.createdAt)}
                      {reply.isEdited && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {currentUser && currentUser._id === reply.author._id && (
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleReplyLike(reply._id, true)}
                    className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {reply.likes}
                  </button>
                  <button
                    onClick={() => toggleReplyLike(reply._id, false)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    {reply.dislikes}
                  </button>
                  <button
                    onClick={() => setReplyingTo(reply._id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                </div>
                
                {reply.replies && reply.replies.length > 0 && (
                  <button
                    onClick={() => toggleReplyExpansion(reply._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {expandedReplies.has(reply._id) ? 'Hide' : 'Show'} {reply.replies.length} replies
                  </button>
                )}
              </div>
              
              {/* Nested Replies */}
              {reply.replies && reply.replies.length > 0 && expandedReplies.has(reply._id) && (
                <div className="mt-4 ml-8 space-y-4">
                  {reply.replies.map((nestedReply) => (
                    <div key={nestedReply._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{nestedReply.author.name}</h5>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {formatDate(nestedReply.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{nestedReply.content}</p>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleReplyLike(nestedReply._id, true)}
                          className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors text-sm"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {nestedReply.likes}
                        </button>
                        <button
                          onClick={() => toggleReplyLike(nestedReply._id, false)}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors text-sm"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          {nestedReply.dislikes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}