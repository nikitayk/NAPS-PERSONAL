// src/services/paymentService.js

import apiClient from "../utils/apiClient";

const paymentService = {
  /**
   * Create a payment intent
   * @param {number} amount - The amount to charge in smallest currency unit (e.g., cents for USD)
   * @returns {Promise<object>} - Payment intent response
   */
  async createPaymentIntent(amount) {
    try {
      const response = await apiClient.post("/payments/create-intent", { amount });
      return response.data; // Returns clientSecret for Stripe
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  },

  /**
   * Confirm a payment
   * @param {string} paymentId - Payment ID to confirm
   * @returns {Promise<object>} - Confirmation response
   */
  async confirmPayment(paymentId) {
    try {
      const response = await apiClient.post(`/payments/confirm`, { paymentId });
      return response.data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  },
};

export default paymentService;
