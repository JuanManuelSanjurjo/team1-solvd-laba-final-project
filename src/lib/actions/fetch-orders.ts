"use server";

import { auth } from "@/auth";
import { getStripe } from "@/lib/get-stripe";
import Stripe from "stripe";

type RetrievedOrder = Stripe.Charge & {
  metadata: {
    strapi_user_id: string;
    items: string;
  };
};

interface FetchOrderResponse {
  data: RetrievedOrder[] | [];
  error: boolean;
  message: string;
}

export async function fetchOrders(): Promise<FetchOrderResponse> {
  const session = await auth();
  const stripe = getStripe();

  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
      data: [],
    };
  }

  if (!session.user.customerId) {
    return {
      error: true,
      message: "Customer ID not found",
      data: [],
    };
  }

  try {
    const charges = await stripe.charges.list({
      customer: session.user.customerId,
    });

    if (charges.data.length === 0) {
      return {
        error: true,
        message: "No orders found",
        data: [],
      };
    }

    return {
      error: false,
      message: "",
      data: charges.data as RetrievedOrder[],
    };
  } catch {
    return {
      error: true,
      message: "Failed to fetch orders",
      data: [],
    };
  }
}
