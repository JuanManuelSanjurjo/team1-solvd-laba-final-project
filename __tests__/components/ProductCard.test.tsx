import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "@/components/ProductCard";

const baseProps = {
  imageUrl: "/assets/product-img.png",
  name: "Nike Air Max 270",
  description: "Women's Shoes",
  size: "8 UK",
};

describe("ProductCard", () => {
  it("renders the product image with correct alt and src", () => {
    render(<ProductCard {...baseProps} backgroundColor="white" />);
    const img = screen.getByRole("img", { name: baseProps.name });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", baseProps.imageUrl);
    expect(img).toHaveAttribute("alt", baseProps.name);
  });

  it("renders name, description, and size label", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText(baseProps.name)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
    expect(screen.getByText(`Size: ${baseProps.size}`)).toBeInTheDocument();
  });

  it("sets a title attribute on the name for tooltip/truncation", () => {
    render(<ProductCard {...baseProps} />);
    const nameEl = screen.getByText(baseProps.name);
    expect(nameEl).toHaveAttribute("title", baseProps.name);
  });

  it("does not require backgroundColor to render", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText(`Size: ${baseProps.size}`)).toBeInTheDocument();
  });
});
