import { OrderStatus } from "@/app/(side-bar)/(profile)/order-history/types";

/**
 * @function
 * @param {string} stripeStatus - The stripe status to normalize.
 * @returns {OrderStatus} - The normalized order status.
 *
 * @example
 * const orderStatus = normalizeStripeStatusToOrderStatus("succeeded");
 * console.log(orderStatus); // Output: "succeeded"
 */
export function normalizeStripeStatusToOrderStatus(
  stripeStatus: string
): OrderStatus {
  switch (stripeStatus) {
    case "succeeded":
      return "succeeded";
    case "canceled":
    case "failed":
    case "requires_payment_method":
    case "requires_confirmation":
    case "requires_action":
      return "failed";
    case "processing":
    case "requires_capture":
    default:
      return "pending";
  }
}
