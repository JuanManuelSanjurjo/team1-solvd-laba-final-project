import { normalizeStripeStatusToOrderStatus } from "@lib/normalizers/normalize-stripe-status-order";
import { OrderStatus } from "@/app/(side-bar)/(profile)/order-history/types";

describe("normalizeStripeStatusToOrderStatus", () => {
  it("returns 'succeeded' for stripeStatus 'succeeded'", () => {
    const result: OrderStatus = normalizeStripeStatusToOrderStatus("succeeded");
    expect(result).toBe("succeeded");
  });

  it("returns 'failed' for stripeStatus 'canceled'", () => {
    const result: OrderStatus = normalizeStripeStatusToOrderStatus("canceled");
    expect(result).toBe("failed");
  });

  it("returns 'failed' for stripeStatus 'requires_payment_method'", () => {
    const result: OrderStatus = normalizeStripeStatusToOrderStatus(
      "requires_payment_method",
    );
    expect(result).toBe("failed");
  });

  it("returns 'failed' for stripeStatus 'requires_confirmation'", () => {
    const result: OrderStatus = normalizeStripeStatusToOrderStatus(
      "requires_confirmation",
    );
    expect(result).toBe("failed");
  });

  it("returns 'failed' for stripeStatus 'requires_action'", () => {
    const result: OrderStatus =
      normalizeStripeStatusToOrderStatus("requires_action");
    expect(result).toBe("failed");
  });

  it("returns 'pending' for stripeStatus 'processing'", () => {
    const result: OrderStatus =
      normalizeStripeStatusToOrderStatus("processing");
    expect(result).toBe("pending");
  });

  it("returns 'pending' for stripeStatus 'requires_capture'", () => {
    const result: OrderStatus =
      normalizeStripeStatusToOrderStatus("requires_capture");
    expect(result).toBe("pending");
  });

  it("returns 'pending' for unknown stripeStatus", () => {
    const result: OrderStatus =
      normalizeStripeStatusToOrderStatus("unknown_status");
    expect(result).toBe("pending");
  });
});
