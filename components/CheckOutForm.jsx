// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Payment logic inside the same component
  const createPaymentIntent = async (amount) => {
    try {
      const response = await axios.post("/api/payments/create-intent", { amount });
      return response.data; // expects { clientSecret: '...' }
    } catch (err) {
      console.error("Error creating payment intent:", err);
      throw err;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const { clientSecret } = await createPaymentIntent(amount);

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      setError("An error occurred while processing your payment.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success ? (
          <p className="text-green-500">Payment successful! Thank you for your purchase.</p>
        ) : (
          <>
            <div className="mb-4">
              <CardElement className="p-2 border rounded" />
            </div>
            <button
              type="submit"
              disabled={processing}
              className={`w-full bg-blue-500 text-white p-2 rounded ${
                processing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {processing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
