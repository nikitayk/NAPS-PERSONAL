import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1e40af", // blue-800 from tailwind
      fontSize: "16px",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      "::placeholder": {
        color: "#93c5fd", // blue-300
      },
    },
    invalid: {
      color: "#dc2626", // red-600
    },
  },
};

interface PaymentFormProps {
  amount: number; // in cents, e.g. 5000 = $50.00
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createPaymentIntent = async (amount: number) => {
    const response = await axios.post("/api/payments/create-intent", { amount });
    return response.data.clientSecret as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.");
      setProcessing(false);
      return;
    }

    try {
      const clientSecret = await createPaymentIntent(amount);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card Element not found.");
        setProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed.");
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);
      } else {
        setError("Payment did not succeed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }

    setProcessing(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Checkout</h2>

        {success ? (
          <p className="text-green-600 text-center text-lg font-semibold">
            Payment successful! Thank you.
          </p>
        ) : (
          <>
            {error && (
              <p className="text-red-600 mb-4 font-medium text-center">{error}</p>
            )}

            <div className="mb-6 border rounded p-3">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <button
              type="submit"
              disabled={processing || !stripe}
              className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
                processing
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
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

export default PaymentForm;
