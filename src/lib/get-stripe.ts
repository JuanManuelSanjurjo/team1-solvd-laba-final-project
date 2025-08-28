import Stripe from "stripe";

let stripe: Stripe | null = null;

/**
 * @function
 * @returns {Stripe} - A stripe instance.
 *
 * @example
 * const stripe = getStripe();
 */
export function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}
