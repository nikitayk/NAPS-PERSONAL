import axios from "axios";

/**
 * Logs in a user.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<any>}
 */
export const login = async (username: string, password: string): Promise<any> => {
  try {
    const response = await axios.post("/api/auth/login", { username, password });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export const logout = async (): Promise<void> => {
  try {
    await axios.post("/api/auth/logout");
    console.log("Logout successful.");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/**
 * Fetches the currently logged-in user's details.
 * @returns {Promise<any>}
 */
export const fetchUser = async (): Promise<any> => {
  try {
    const response = await axios.get("/api/auth/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
