import "@testing-library/jest-dom";
import { render, screen } from "../../utils/test-utils";
import LeftBoxFormContainer from "@/app/auth/components/LeftBoxFormContainer";

describe("LeftBoxFormContainer Component", () => {
  it("renders children correctly", () => {
    render(
      <LeftBoxFormContainer>
        <div data-testid="test-content">Form Content</div>
      </LeftBoxFormContainer>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Form Content")).toBeInTheDocument();
  });
});
