import { render, screen } from "@testing-library/react";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";

describe("LogoBlackSvg", () => {
  it("renders the SVG with default width and height", () => {
    render(<LogoBlackSvg />);
    const svg = screen.queryByTestId("logo-svg");

    expect(svg).toBeInTheDocument();

    expect(svg).toHaveAttribute("width", "41");
    expect(svg).toHaveAttribute("height", "31");
    expect(svg).toHaveAttribute("viewBox", "0 0 41 31");
  });

  it("renders the SVG with custom width and height", () => {
    render(<LogoBlackSvg width={100} height={50} />);
    const svg = screen.getByTestId("logo-svg");

    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "50");
  });
});
