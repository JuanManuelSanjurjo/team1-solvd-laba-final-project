import { auth } from "@/auth";
import Checkout from "./components/Checkout";
import { redirect } from "next/navigation";

/**
 * CheckoutPage component that handles the complete checkout process including:
 * - Personal and shipping information collection via form inputs
 * - Stripe payment integration using PaymentElement
 * - Form validation with React Hook Form and Zod schema
 * - Payment confirmation and redirect to thank-you page on success
 *
 * @component
 * @returns {JSX.Element} A complete checkout form with payment, personal, and shipping sections
 */
export default async function CheckoutPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/auth/sign-in");
  }

  return <Checkout session={session} />;
}
