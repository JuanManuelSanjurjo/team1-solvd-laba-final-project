import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LogoBlackSvg } from "@/components/LogoBlackSvg";

describe("LogoBlackSvg", () => {
  it("renders an <svg> with default values", () => {
    const { container } = render(<LogoBlackSvg />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "41");
    expect(svg).toHaveAttribute("height", "31");
    expect(svg).toHaveAttribute("viewBox", "0 0 41 31");
  });

  it("accepts custom width/height", () => {
    const { container } = render(<LogoBlackSvg width={100} height={50} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "50");
  });

  it("falls back to default height when only width is provided", () => {
    const { container } = render(<LogoBlackSvg width={64} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "64");
    expect(svg).toHaveAttribute("height", "31");
  });

  it("contains 2 ellipses and 2 rectangles with black fill", () => {
    const { container } = render(<LogoBlackSvg />);
    const ellipses = container.querySelectorAll("ellipse");
    const rects = container.querySelectorAll("rect");

    expect(ellipses).toHaveLength(2);
    expect(rects).toHaveLength(2);

    ellipses.forEach((el) => expect(el).toHaveAttribute("fill", "black"));
    rects.forEach((r) => expect(r).toHaveAttribute("fill", "black"));
  });
});
