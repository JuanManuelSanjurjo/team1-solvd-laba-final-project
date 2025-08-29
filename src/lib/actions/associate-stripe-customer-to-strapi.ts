"use server";

import { auth } from "@/auth";
import Stripe from "stripe";
import { handleApiError } from "../normalizers/handle-api-error";

/**
 * @action
 * @param {Object} params - Parameters for the action.
 * @param {Stripe.Customer} params.customerId - The Stripe customer ID to associate with the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await associateStripeCustomerToStrapi({
 *   customerId: stripeCustomerId,
 * });
 */
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
