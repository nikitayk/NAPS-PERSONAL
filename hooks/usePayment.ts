import { useState } from "react";
import axios from "axios";
import { Stripe, StripeElements } from "@stripe/stripe-js";

interface UsePaymentReturn {
  processing: boolean;
  error: string | null;
  success: boolean;
  createAndConfirmPayment: (
    stripe: Stripe | null,
    elements: StripeElements | null,
    amount: number
  ) => Promise<void>;
}

const usePayment = (): UsePaymentReturn => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createPaymentIntent = async (amount: number): Promise<string> => {
    const response = await axios.post("/api/payments/create-intent", { amount });
    return response.data.clientSecret as string;
  };

  const createAndConfirmPayment = async (
    stripe: Stripe | null,
    elements: StripeElements | null,
    amount: number
  ): Promise<void> => {
    setProcessing(true);
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded.");
      setProcessing(false);
      return;
    }

    try {
      const clientSecret = await createPaymentIntent(amount);

      const cardElement = elements.getElement("card");
      if (!cardElement) {
        setError("Card Element not found.");
        setProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
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
      setError("Unexpected error occurred.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return { processing, error, success, createAndConfirmPayment };
};

export default usePayment;
