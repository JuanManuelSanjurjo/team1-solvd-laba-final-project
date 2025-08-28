import { Session } from "next-auth";
import { getStripe } from "../get-stripe";

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
