import axios from "axios";

export interface Transaction {
  id: string;
  stockSymbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  date: string;
  status: "pending" | "completed" | "failed";
}

/**
 * Fetch all transactions for the user.
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axios.get("/api/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

/**
 * Create a new transaction.
 */
export const createTransaction = async (
  stockSymbol: string,
  type: "buy" | "sell",
  quantity: number,
  price: number
): Promise<Transaction> => {
  try {
    const response = await axios.post("/api/transactions", {
      stockSymbol,
      type,
      quantity,
      price,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

/**
 * Fetch transaction by ID.
 */
export const fetchTransactionById = async (transactionId: string): Promise<Transaction> => {
  try {
    const response = await axios.get(`/api/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${transactionId}:`, error);
    throw error;
  }
};
