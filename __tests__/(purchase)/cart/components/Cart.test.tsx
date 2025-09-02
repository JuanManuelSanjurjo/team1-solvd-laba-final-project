import { render, screen, waitFor } from "@testing-library/react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import createStripeCustomer from "@/lib/actions/create-stripe-customer";
import Checkout from "@/app/(purchase)/checkout/components/Checkout";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
jest.mock("@/store/cart-store", () => ({ useCartStore: jest.fn() }));
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/lib/actions/create-stripe-customer");

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: any) => <div data-testid="elements">{children}</div>,
}));
jest.mock("@stripe/stripe-js", () => ({ loadStripe: jest.fn() }));

jest.mock("@/app/loading", () => {
  function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  }
  return MockLoading;
});

const mockUseCartStore = jest.mocked(useCartStore);
const mockUseSession = useSession as jest.Mock;
const mockCreateCustomer = createStripeCustomer as jest.Mock;

const baseSession = {
  user: { id: "user123", email: "test@test.com", customerId: null },
};

const baseCart = {
  total: () => 100,
  byUser: {
    user123: [{ id: 1, price: 100, size: 42, quantity: 1 }],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

// ==== Tests ====
describe("Checkout (Stripe)", () => {
  it("muestra loading mientras inicializa checkout", async () => {
    mockUseCartStore.mockReturnValue(baseCart);
    mockUseSession.mockReturnValue({
      data: baseSession,
      update: jest.fn(),
      status: "authenticated",
    });

    // If fetch doesn't resolve it loads
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Checkout session={baseSession as any} />);
    expect(await screen.findByTestId("loading")).toBeInTheDocument();
  });

  it("renders Checkout when the clientSecret is obtained", async () => {
    mockUseCartStore.mockReturnValue(baseCart);
    mockUseSession.mockReturnValue({
      data: baseSession,
      update: jest.fn(),
      status: "authenticated",
    });

    mockCreateCustomer.mockResolvedValue({ customer: { id: "customer123" } });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ clientSecret: "secret123", orderId: "order1" }),
    });

    render(<Checkout session={baseSession as any} />);

    await waitFor(() => {
      expect(screen.getByTestId("elements")).toBeInTheDocument();
      expect(screen.getByText(/CheckoutForm/i)).toBeInTheDocument();
    });
  });

  it("not render Checkout if fetch fails", async () => {
    mockUseCartStore.mockReturnValue(baseCart);
    mockUseSession.mockReturnValue({
      data: baseSession,
      update: jest.fn(),
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    render(<Checkout session={baseSession as any} />);

    await waitFor(() => {
      expect(screen.queryByTestId("elements")).not.toBeInTheDocument();
    });
  });
});
