import { render, screen } from "@testing-library/react";
import CardActionWrapperCenter from "@/components/cards/wrappers/CardActionWrapperCenter";

const MockAddTocartButton = () => <button>Add to cart</button>;
const MockDeleteButton = () => <button>Delete</button>;

describe("CardActionWrapperCenter", () => {
  it("renders the action addToCartButton", () => {
    render(<CardActionWrapperCenter action={<MockAddTocartButton />} />);
    expect(screen.getByText("Add to cart")).toBeInTheDocument();
  });
  it("renders the action deleteButton", () => {
    render(<CardActionWrapperCenter action={<MockDeleteButton />} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
