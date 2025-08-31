import ProfileHeaderTitle from "@/app/(side-bar)/(profile)/components/ProfileHeaderTitle";
import { render, screen } from "__tests__/utils/test-utils";

describe("ProfileHeaderTitle", () => {
  it("should render without crashing", () => {
    render(<ProfileHeaderTitle>Test Title</ProfileHeaderTitle>);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
