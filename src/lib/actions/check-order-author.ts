import { Session } from "next-auth";
import { getStripe } from "../get-stripe";

/**
 * @action
 * @param {string} orderId - The ID of the order to check.
 * @param {Session} session - The user session object.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the order is authorized.
 *
 * @example
 * const isAuthorized = await checkOrderAuthor(orderId, session);
 */
export default async function checkOrderAuthor(
  orderId: string,
  session: Session
) {
  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(orderId);

    if (paymentIntent.metadata.strapi_user_id !== session.user.id) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
