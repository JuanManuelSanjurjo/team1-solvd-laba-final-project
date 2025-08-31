"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import CheckoutForm from "./CheckoutForm";
import { Session } from "next-auth";
import createStripeCustomer from "@/lib/actions/create-stripe-customer";
import { CartItem } from "../../cart/types";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { IMAGE_BUCKET_URL } from "@/lib/constants/globals";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/**
 * Checkout component that initializes Stripe payment processing.
 * Handles customer creation, payment intent setup, and Stripe Elements configuration.
 * Manages loading states and renders the checkout form when ready.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Session} props.session - Next-auth session object containing user information
 * @returns {JSX.Element} The rendered Stripe Elements wrapper with checkout form or loading state
 */
export default function Checkout({ session }: { session: Session }) {
  const userId = session.user.id;
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const { update } = useSession();

  const total = useCartStore((s) => s.total(userId));
  const byUser = useCartStore((state) => state.byUser);
  const items: CartItem[] = useMemo(() => {
    return userId ? byUser[userId] ?? [] : [];
  }, [userId, byUser]);

  useEffect(() => {
    if (items.length === 0) {
      useToastStore.getState().show({
        severity: "warning",
        message: "Please add items to your cart before checking out.",
      });
      router.push("/products");
    }
  }, [items.length, router]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const initializeCheckout = async () => {
      setIsLoading(true);

      try {
        let customerId = session.user.customerId;

        if (!customerId) {
          const customerResult = await createStripeCustomer({
            email: session.user.email,
          });

          if (customerResult?.customer) {
            customerId = customerResult.customer.id;
            update({ trigger: "update" });
          }
        }

        const response = await fetch("/api/checkout/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemsLength: items.length,
            amount: total,
            customer: customerId,
            ...items.reduce((acc, item) => {
              acc[`item-${item.id}-${item.size}`] = {
                id: item.id,
                image: item.image?.replace(IMAGE_BUCKET_URL, "") || "",
                name: item.name,
                price: item.price,
                size: item.size,
                gender: item.gender,
                quantity: item.quantity,
              };
              return acc;
            }, {} as Record<string, CartItem>),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { clientSecret: string; orderId: string } =
          await response.json();

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error initializing checkout:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, total, session.user.email]);

  const options: StripeElementsOptions = {
    clientSecret,
    fonts: [
      {
        cssSrc:
          "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
      },
    ],
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#FE645E",
        colorBackground: "#ffffff",
        iconColor: "#292D32",
        colorText: "#494949",
        borderRadius: "12px",
      },
    },
  } as const;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm userId={userId} />
        </Elements>
      )}
    </>
  );
}
