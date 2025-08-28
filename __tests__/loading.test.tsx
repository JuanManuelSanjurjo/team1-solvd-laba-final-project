import { render, screen } from "@testing-library/react";
import Loading from "@/app/loading";

describe("Loading", () => {
  it("should render the loading page", () => {
    render(<Loading />);
    const loading = screen.getByAltText("Loading...");

    expect(loading).toBeInTheDocument();
  });
});
