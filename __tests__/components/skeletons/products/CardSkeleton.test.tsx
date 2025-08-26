import { render, screen } from "@testing-library/react";
import CardSkeleton from "@/components/skeletons/products/CardSkeleton";

describe("CardSkeleton Component", () => {
  it("should render the component", () => {
    render(<CardSkeleton />);

    const cardSkeleton = screen.getByTestId("card-skeleton");
    expect(cardSkeleton).toBeInTheDocument();
  });
});
