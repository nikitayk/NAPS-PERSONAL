import axios from "axios";

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
}

/**
 * Fetch user badges.
 */
export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  try {
    const response = await axios.get(`/api/gamification/users/${userId}/badges`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching badges for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetch leaderboard.
 */
export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await axios.get("/api/gamification/leaderboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};
