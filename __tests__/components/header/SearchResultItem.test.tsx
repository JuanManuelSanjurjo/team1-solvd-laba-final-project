import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultItem from "@/components/header/SearchResultItem";

jest.mock("@mui/material", () => {
  return {
    Box: ({ children, component, ...props }: any) => {
      if (component === "img") {
        const { src, alt, width, height, ...rest } = props;
        return (
          <img
            src={src}
            alt={alt}
            width={width?.md ?? width?.xs ?? width}
            height={height?.md ?? height?.xs ?? height}
            {...rest}
          />
        );
      }
      return (
        <div data-testid={props["data-testid"]} {...props}>
          {children}
        </div>
      );
    },
    Typography: ({ children, ...props }: { children: React.ReactNode }) => (
      <p {...props}>{children}</p>
    ),
  };
});

describe("SearchResultItem", () => {
  const mockSetIsSearching = jest.fn();

  const baseProduct = {
    id: 42,
    name: "Test Sneaker",
    gender: "Unisex",
    price: 9999,
    image: "https://example.com/test-sneaker.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders image, name and price", () => {
    render(
      <SearchResultItem
        product={baseProduct}
        setIsSearching={mockSetIsSearching}
      />,
    );

    const img = screen.getByAltText(baseProduct.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(baseProduct.image);

    expect(screen.getByText(baseProduct.name)).toBeInTheDocument();

    expect(screen.getByText(`$ ${baseProduct.price}`)).toBeInTheDocument();

    const container = screen.getByText(baseProduct.name).closest("div");
    expect(container).toHaveAttribute("href", `/products/${baseProduct.id}`);
  });

  it("calls setIsSearching(false) when clicked", () => {
    render(
      <SearchResultItem
        product={baseProduct}
        setIsSearching={mockSetIsSearching}
      />,
    );

    const container = screen.getByText(baseProduct.name).closest("div")!;
    fireEvent.click(container);

    expect(mockSetIsSearching).toHaveBeenCalledWith(false);
  });

  it("uses placeholder image when product image is missing", () => {
    const productNoImage = { ...baseProduct, image: "" };
    render(
      <SearchResultItem
        product={productNoImage}
        setIsSearching={mockSetIsSearching}
      />,
    );

    const img = screen.getByAltText(productNoImage.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/assets/images/placeholders/70x70.svg");
  });
});
