import Loading from "@/app/(purchase)/cart/loading";
import { render, screen } from "__tests__/utils/test-utils";

describe("Cart Loading", () => {
  it("it should render without crashing", () => {
    render(<Loading />);

    expect(screen.getByText("Cart")).toBeInTheDocument();
  });
});
