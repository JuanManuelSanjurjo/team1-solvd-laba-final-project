"use server";

import { auth } from "@/auth";
import { getStripe } from "../get-stripe";
import associateStripeCustomerToStrapi from "./associate-stripe-customer-to-strapi";
import Stripe from "stripe";

/**
 * @action
 * @param {Object} params - Parameters for the action.
 * @param {string} params.email - The email address of the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * await createStripeCustomer({
 *   email: "user@example.com",
 * });
 */
export default async function createStripeCustomer({
  email,
}: {
  email: string;
}) {
  const stripe = getStripe();
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  try {
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const existingCustomer = existingCustomers.data[0];

      await associateStripeCustomerToStrapi({
        customerId: existingCustomer as Stripe.Customer,
      });

      return {
        error: false,
        customer: existingCustomer,
      };
    }

    const customer = await stripe.customers.create({
      email,
      metadata: {
        strapi_user_id: session?.user?.id,
      },
    });

    if (!customer) {
      return {
        error: true,
        message: "Failed to create stripe customer",
      };
    }

    await associateStripeCustomerToStrapi({
      customerId: customer as Stripe.Customer,
    });

    return {
      error: false,
      customer: customer,
      isExisting: false,
    };
  } catch (error) {
    console.error("Error in createStripeCustomer:", error);
    return {
      error: true,
      message: "Failed to create or retrieve stripe customer",
    };
  }
}
