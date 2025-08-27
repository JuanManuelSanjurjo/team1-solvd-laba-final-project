import { render, screen } from "@testing-library/react";
import CardActionWrapperTopRight from "@/components/cards/wrappers/CardActionWrapperTopRight";

const MockMenuButton = () => <button>Menu</button>;
const MockWishlistButton = () => <button>Wishlist</button>;

describe("CardActionWrapperTopRight", () => {
  it("renders the action CardButtonMenu", () => {
    render(<CardActionWrapperTopRight action={<MockMenuButton />} />);
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("renders the action CardButtonWishList", () => {
    render(<CardActionWrapperTopRight action={<MockWishlistButton />} />);
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
  });
});
