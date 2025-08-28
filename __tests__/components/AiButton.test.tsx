import { render, screen, fireEvent } from "@testing-library/react";
import AiButton from "@/components/AiButton";
import React from "react";

jest.mock("next/image", () => ({ src, alt, width, height }: any) => {
  return <img src={src} alt={alt} width={width} height={height} />;
});

describe("AiButton", () => {
  it("renders with label when not loading", () => {
    render(<AiButton label="Generate" />);
    expect(screen.getByText("Generate")).toBeInTheDocument();
    const img = screen.getByAltText("Logo");
    expect(img).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<AiButton label="Generate" isLoading />);
    const img = screen.getAllByAltText("Logo");
    expect(img.length).toBeGreaterThan(0);
    expect(screen.queryByText("Generate")).not.toBeInTheDocument();
  });

  it("calls onGenerate when clicked", () => {
    const onGenerate = jest.fn();
    render(<AiButton label="Generate" onGenerate={onGenerate} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });

  it("applies correct styles for isLoading", () => {
    const { container } = render(<AiButton label="Generate" isLoading />);
    const button = container.querySelector("button");
    expect(button).toHaveStyle("animation: pulse 1s infinite alternate");
    expect(button).toHaveStyle("background: #F7635E1A");
  });

  it("applies correct styles when not loading", () => {
    const { container } = render(<AiButton label="Generate" />);
    const button = container.querySelector("button");
    expect(button).toHaveStyle(
      "background: linear-gradient(to right, #FE645E, #CD3C37)",
    );
    expect(button).toHaveStyle("animation: none");
  });
});
