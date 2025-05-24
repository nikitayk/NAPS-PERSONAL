import axios from "axios";

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  replies?: ForumPost[];
}

/**
 * Fetch all forum posts.
 */
export const fetchForumPosts = async (): Promise<ForumPost[]> => {
  try {
    const response = await axios.get("/api/forum/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    throw error;
  }
};

/**
 * Create a new forum post.
 */
export const createForumPost = async (content: string): Promise<ForumPost> => {
  try {
    const response = await axios.post("/api/forum/posts", { content });
    return response.data;
  } catch (error) {
    console.error("Error creating forum post:", error);
    throw error;
  }
};

/**
 * Reply to a forum post.
 */
export const replyToPost = async (postId: string, content: string): Promise<ForumPost> => {
  try {
    const response = await axios.post(`/api/forum/posts/${postId}/replies`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error replying to post ${postId}:`, error);
    throw error;
  }
};
