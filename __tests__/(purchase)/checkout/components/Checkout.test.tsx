import { render, screen, waitFor } from "@testing-library/react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import createStripeCustomer from "@/lib/actions/create-stripe-customer";
import { CartState } from "@/app/(purchase)/cart/types";
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
const mockUseSession = useSession as jest.Mock;
const mockCreateCustomer = createStripeCustomer as jest.Mock;

import Checkout from "@/app/(purchase)/checkout/components/Checkout";

const mockSession = {
  user: { id: "user123", email: "test@test.com", customerId: null },
};

const mockedState: CartState = {
  byUser: {
    user123: [
      {
        id: 1,
        name: "Test",
        price: 100,
        image: "",
        size: 42,
        gender: "Men",
        quantity: 1,
      },
    ],
  },
  addItem: jest.fn(),
  removeItem: jest.fn(),
  totalItems: jest.fn(),
  clearCart: jest.fn(),
  updateQuantity: jest.fn(),
  totalOfProduct: jest.fn(),
  subtotal: jest.fn(),
  taxes: jest.fn(),
  shipping: jest.fn(),
  total: () => 100,
};

mockUseCartStore.mockImplementation((selector: (s: CartState) => any) =>
  selector(mockedState)
);

//Testing
describe("Checkout (Stripe)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState)
    );
  });

  it("shows loading while checkout is initializing", async () => {
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState)
    );

    mockUseSession.mockReturnValue({
      data: mockSession,
      update: jest.fn(),
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Checkout session={mockSession as any} />);
    expect(await screen.findByTestId("loading")).toBeInTheDocument();
  });

  it("renders CheckoutForm when clientSecret is obtained", async () => {
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState)
    );

    mockUseSession.mockReturnValue({
      data: mockSession,
      update: jest.fn(),
      status: "authenticated",
    });

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

  it("not render CheckoutForm if fetch fails", async () => {
    mockUseCartStore.mockImplementation((selector: any) =>
      selector(mockedState)
    );

    mockUseSession.mockReturnValue({
      data: mockSession,
      update: jest.fn(),
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    render(<Checkout session={mockSession as any} />);

    await waitFor(() => {
      expect(screen.queryByTestId("elements")).not.toBeInTheDocument();
    });
  });
});
