import { render, screen, waitFor } from "@testing-library/react";
import Card from "@/components/cards/Card";

jest.mock("@/components/cards/actions/CardButtonMenu", () =>
  jest.fn(() => <div>CardButtonMenu</div>),
);
jest.mock("@/components/cards/actions/CardButtonWishList", () =>
  jest.fn(() => <div>CardButtonWishList</div>),
);
jest.mock("@/components/cards/actions/CardOverlayAddToCart", () =>
  jest.fn(() => <div>CardOverlayAddToCart</div>),
);
jest.mock("@/components/cards/actions/CardOverlayDelete", () =>
  jest.fn(() => <div>CardOverlayDelete</div>),
);

const mockProduct = {
  id: 1,
  name: "Nike Air",
  price: 120,
  image: "nike.jpg",
  gender: "Men",
  sizes: [42, 43],
};

describe("Card component - full coverage", () => {
  it("renders product image and text when showText is true", async () => {
    render(<Card session={null} product={mockProduct} />);
    expect(await screen.findByText("Nike Air")).toBeInTheDocument();
    expect(screen.getByText("$120")).toBeInTheDocument();
    expect(screen.getByText("Men's shoes")).toBeInTheDocument();
  });

  it("does not render text when showText is false", async () => {
    render(<Card session={null} product={mockProduct} showText={false} />);
    await waitFor(() => {
      expect(screen.queryByText("Nike Air")).not.toBeInTheDocument();
    });
  });

  it("renders topAction as CardButtonMenu", async () => {
    render(
      <Card session={null} product={mockProduct} topAction="cardButtonMenu" />,
    );
    expect(await screen.findByText("CardButtonMenu")).toBeInTheDocument();
  });

  it("renders topAction as CardButtonWishList", async () => {
    render(
      <Card
        session={{ user: { name: "John" }, expires: "" } as any}
        product={mockProduct}
        topAction="wishList"
      />,
    );
    expect(await screen.findByText("CardButtonWishList")).toBeInTheDocument();
  });

  it("renders overlayAction as CardOverlayAddToCart", async () => {
    render(
      <Card
        session={null}
        product={mockProduct}
        overlayAction="cardOverlayAddToCart"
      />,
    );
    expect(await screen.findByText("CardOverlayAddToCart")).toBeInTheDocument();
  });

  it("renders overlayAction as CardOverlayDelete", async () => {
    render(
      <Card
        session={null}
        product={mockProduct}
        overlayAction="cardOverlayDelete"
      />,
    );
    expect(await screen.findByText("CardOverlayDelete")).toBeInTheDocument();
  });

  it("renders topAction and overlayAction together", async () => {
    render(
      <Card
        session={{ user: { name: "Jane" }, expires: "" } as any}
        product={mockProduct}
        topAction="wishList"
        overlayAction="cardOverlayAddToCart"
      />,
    );
    expect(await screen.findByText("CardButtonWishList")).toBeInTheDocument();
    expect(await screen.findByText("CardOverlayAddToCart")).toBeInTheDocument();
  });

  it("renders correctly when product id is undefined", async () => {
    const productNoId = { ...mockProduct, id: undefined };
    render(<Card session={null} product={productNoId} />);
    await waitFor(() => {
      expect(screen.getByText("Nike Air")).toBeInTheDocument();
    });
  });
});
