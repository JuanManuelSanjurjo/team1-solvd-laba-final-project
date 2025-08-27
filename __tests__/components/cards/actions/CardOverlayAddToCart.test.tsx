import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardOverlayAddToCart from "@/components/cards/actions/CardOverlayAddToCart";
import { Session } from "next-auth";
import { product } from "@/mocks/product";
import { useCartStore } from "@/store/cart-store";

const mockProduct = { ...product, image: "http://example.com/image.jpg" };
const mockSession: Session = {
  user: { id: "user-123", username: "Juan", email: "a@b.com", jwt: "" },
  expires: "9999-12-31T23:59:59.999Z",
};

jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

jest.mock(
  "@/app/(purchase)/components/SizeSelectorModal",
  () =>
    function SizeSelectorModalMock({
      showModal,
      onClose,
      title,
      primaryBtn,
      secondaryBtn,
      onPrimary,
      children,
    }: {
      showModal: boolean;
      onClose: (e: React.SyntheticEvent) => void;
      onPrimary: (e: React.MouseEvent<HTMLButtonElement>) => void;
      title: string;
      text?: string;
      secondaryBtn?: string;
      primaryBtn?: string;
      children?: React.ReactNode;
    }) {
      if (!showModal) return null;
      return (
        <div role="dialog">
          <h1>{title}</h1>
          <div>{children}</div>
          <button onClick={onPrimary}>{primaryBtn}</button>
          <button onClick={onClose}>{secondaryBtn}</button>
        </div>
      );
    },
);

jest.mock(
  "@/components/form-elements/Select",
  () =>
    function SelectMock(props: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    }) {
      return (
        <select
          data-testid="select-size"
          value={props.value}
          onChange={props.onChange}
        >
          <option value="">choose</option>
          <option value="38">38</option>
          <option value="42">42</option>
        </select>
      );
    },
);

describe("CardOverlayAddToCart", () => {
  const mockAddItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ addItem: mockAddItem }),
    );
  });

  it("renders the Add to cart trigger", () => {
    render(
      <CardOverlayAddToCart product={mockProduct} session={mockSession} />,
    );
    expect(screen.getByText(/Add to cart/i)).toBeInTheDocument();
  });

  it("opens the SizeSelectorModal when clicking the overlay", async () => {
    const user = userEvent.setup();
    render(
      <CardOverlayAddToCart product={mockProduct} session={mockSession} />,
    );

    await user.click(screen.getByText(/Add to cart/i));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Select a size/i }),
    ).toBeTruthy();
  });

  it("calls addItem with correct payload when selecting a size and confirming", async () => {
    const user = userEvent.setup();
    render(
      <CardOverlayAddToCart product={mockProduct} session={mockSession} />,
    );

    await user.click(screen.getByText(/Add to cart/i));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const select = screen.getByTestId("select-size");
    await user.selectOptions(select, "42");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith("user-123", {
      id: mockProduct.id,
      image: mockProduct.image,
      name: mockProduct.name,
      price: mockProduct.price,
      quantity: 1,
      gender: mockProduct.gender,
      size: 42,
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("does NOT call addItem when there is no session (userId falsy)", async () => {
    const user = userEvent.setup();
    render(<CardOverlayAddToCart product={mockProduct} session={null} />);

    await user.click(screen.getByText(/Add to cart/i));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const select = screen.getByTestId("select-size");
    await user.selectOptions(select, "38");

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it("closes the modal when clicking Cancel (secondary button)", async () => {
    const user = userEvent.setup();
    render(
      <CardOverlayAddToCart product={mockProduct} session={mockSession} />,
    );

    await user.click(screen.getByText(/Add to cart/i));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
