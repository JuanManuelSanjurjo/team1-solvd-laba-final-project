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
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    fetch("/api/checkout/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      });
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#FE645E",
        colorBackground: "#ffffff",
        iconColor: "#292D32",
        colorText: "#494949",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        borderRadius: "12px",
      },
    },
  } as const;

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      )}
    </>
  );
}
