jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

import { render, screen, waitFor } from "@testing-library/react";
import { useCartStore } from "@/store/cart-store";
import createStripeCustomer from "@/lib/actions/create-stripe-customer";
import Checkout from "@/app/(purchase)/checkout/components/Checkout";
import { createMockCartState } from "__tests__/(purchase)/test-utils/cartState";
import { mockSession } from "__tests__/(purchase)/test-utils/auth";
import { mockAuthenticatedSession } from "__tests__/(purchase)/test-utils/session";

// Mocks
jest.mock("@/store/cart-store", () => ({ useCartStore: jest.fn() }));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

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

jest.mock("@/app/(purchase)/checkout/components/CheckoutForm", () => {
  function MockCheckoutForm() {
    return <div>CheckoutForm</div>;
  }
  return MockCheckoutForm;
});

const mockUseCartStore = jest.mocked(useCartStore);
const mockCreateCustomer = createStripeCustomer as jest.Mock;

const mockedState = createMockCartState([
  {
    id: 1,
    name: "Test",
    price: 100,
    image: "",
    size: 42,
    gender: "Men",
    quantity: 1,
  },
]);

mockUseCartStore.mockImplementation((selector: any) => selector(mockedState));

//Testing
describe("Checkout (Stripe)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState)
    );
  });

  it("should show loading while checkout is initializing", async () => {
    mockAuthenticatedSession();

    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Checkout session={mockSession as any} />);
    expect(await screen.findByTestId("loading")).toBeInTheDocument();
  });

  it("should render CheckoutForm when clientSecret is obtained", async () => {
    mockAuthenticatedSession();

    mockCreateCustomer.mockResolvedValue({ customer: { id: "cus_abc" } });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ clientSecret: "secret123", orderId: "order1" }),
    });

    render(<Checkout session={mockSession as any} />);

    await waitFor(() => {
      expect(screen.getByTestId("elements")).toBeInTheDocument();
      expect(screen.getByText(/CheckoutForm/i)).toBeInTheDocument();
    });
  });

  it("should not render CheckoutForm if fetch fails", async () => {
    mockAuthenticatedSession();

    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    render(<Checkout session={mockSession as any} />);

    await waitFor(() => {
      expect(screen.queryByTestId("elements")).not.toBeInTheDocument();
    });
  });
});
