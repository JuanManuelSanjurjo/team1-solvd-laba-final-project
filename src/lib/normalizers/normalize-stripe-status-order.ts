import { OrderStatus } from "@/app/(side-bar)/(profile)/order-history/types";

export function normalizeStripeStatusToOrderStatus(
  stripeStatus: string
): OrderStatus {
  switch (stripeStatus) {
    case "succeeded":
      return "succeeded";
    case "canceled":
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
