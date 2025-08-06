import "@testing-library/jest-dom";
import { render, screen } from "../../utils/test-utils";
import MainContainer from "@/app/auth/components/MainContainer";

describe("MainContainer Component", () => {
  it("renders children correctly", () => {
    render(
      <MainContainer>
        <div data-testid="test-content">Form Content</div>
      </MainContainer>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Form Content")).toBeInTheDocument();
  });
});
