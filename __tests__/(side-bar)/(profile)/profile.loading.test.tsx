import ProfileLoading from "@/app/(side-bar)/(profile)/loading";
import { render, screen } from "__tests__/utils/test-utils";

describe("Profile Loading", () => {
  it("should render without crashing", () => {
    render(<ProfileLoading />);

    expect(screen.getByAltText("Loading...")).toBeInTheDocument();
  });
});
