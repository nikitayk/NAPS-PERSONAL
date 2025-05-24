import axios from "axios";

export interface FraudAlert {
  id: string;
  transactionId: string;
  reason: string;
  flaggedAt: string;
  status: "pending" | "reviewed" | "cleared";
}

/**
 * Fetch fraud alerts.
 */
export const fetchFraudAlerts = async (): Promise<FraudAlert[]> => {
  try {
    const response = await axios.get("/api/fraud/alerts");
    return response.data;
  } catch (error) {
    console.error("Error fetching fraud alerts:", error);
    throw error;
  }
};

/**
 * Mark a fraud alert as reviewed or cleared.
 */
export const updateFraudAlertStatus = async (
  alertId: string,
  status: FraudAlert["status"]
): Promise<FraudAlert> => {
  try {
    const response = await axios.patch(`/api/fraud/alerts/${alertId}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating fraud alert ${alertId}:`, error);
    throw error;
  }
};
