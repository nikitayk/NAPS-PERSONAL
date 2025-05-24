import axios from "axios";

/**
 * Logs an analytics event to the server.
 * @param {string} event - The event name.
 * @param {Record<string, any>} data - Additional data for the event.
 * @returns {Promise<void>}
 */
export const logEvent = async (event: string, data: Record<string, any> = {}): Promise<void> => {
  try {
    await axios.post("/api/analytics/event", { event, data });
    console.log(`Event "${event}" logged successfully.`);
  } catch (error) {
    console.error(`Error logging event "${event}":`, error);
  }
};

/**
 * Fetches analytics data for a given metric.
 * @param {string} metric - The metric name to fetch data for.
 * @returns {Promise<any>}
 */
export const fetchAnalytics = async (metric: string): Promise<any> => {
  try {
    const response = await axios.get(`/api/analytics/metric?name=${metric}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching analytics for metric "${metric}":`, error);
    throw error;
  }
};
