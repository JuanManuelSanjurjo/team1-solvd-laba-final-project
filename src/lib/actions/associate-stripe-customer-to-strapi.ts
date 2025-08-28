"use server";

import { auth } from "@/auth";
import Stripe from "stripe";
import { handleApiError } from "../normalizers/handle-api-error";

export default async function associateStripeCustomerToStrapi({
  customerId,
}: {
  customerId: Stripe.Customer;
}) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.jwt}`,
      },
      body: JSON.stringify({ customerId: customerId.id }),
    }
  );

  if (!response.ok) {
    return await handleApiError(response, "Failed to update user");
  }

  return {
    error: false,
    message: "Success, details updated!",
  };
}
