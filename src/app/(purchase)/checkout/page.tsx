"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/CheckoutForm";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined
  );
  const total = useCartStore((s) => s.total());
  useEffect(() => {
    // Call API create-intent

    fetch("/checkout/api/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: "flat",
      variables: {
        colorPrimary: "#1976d2", // azul Material UI
        colorBackground: "#ffffff",
        colorText: "#000000",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          border: "1px solid #ccc",
          padding: "12px",
        },
        ".Input:focus": {
          borderColor: "#1976d2",
        },
      },
    },
    paymentElementOptions: {
      layout: {
        type: "tabs",
        defaultCollapsed: false,
      },
    },
  } as const;

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}
