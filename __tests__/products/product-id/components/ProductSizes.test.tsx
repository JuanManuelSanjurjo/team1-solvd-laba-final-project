import { render, screen, fireEvent } from "@testing-library/react";
import ProductSizes from "@/app/products/[product-id]/components/ProductSizes";
import { NormalizedProduct } from "@/types/product-types";
import { Session } from "next-auth";

jest.mock("@/app/products/[product-id]/components/ShoeSizeOption", () => {
  return function MockShoeSizeOption(props: any) {
    return (
      <div
        data-testid={`shoe-size-${props.size}`}
        data-disabled={props.disabled}
        data-checked={props.checked}
        onClick={() => props.onToggle(props.size)}
      >
        {props.size}
      </div>
    );
  };
});

const baseProduct: NormalizedProduct = {
  id: "1",
  name: "Test Shoe",
  sizes: [
    { id: "a", value: 40 },
    { id: "b", value: 41 },
  ],
} as any;

const mockSession: Session = {
  user: { id: "123", name: "John", email: "john@test.com" },
  expires: "fake-date",
};

describe("ProductSizes", () => {
  it("renders the title", () => {
    render(
      <ProductSizes
        product={baseProduct}
        selectedSizes={[]}
        toggleSize={jest.fn()}
        session={mockSession}
      />,
    );

    expect(screen.getByText("Select Size")).toBeInTheDocument();
  });

  it("renders ShoeSizeOption when product has sizes", () => {
    render(
      <ProductSizes
        product={baseProduct}
        selectedSizes={[]}
        toggleSize={jest.fn()}
        session={mockSession}
      />,
    );

    expect(screen.getByTestId("shoe-size-40")).toBeInTheDocument();
    expect(screen.getByTestId("shoe-size-41")).toBeInTheDocument();
  });

  it("disables ShoeSizeOption when session is null", () => {
    render(
      <ProductSizes
        product={baseProduct}
        selectedSizes={[]}
        toggleSize={jest.fn()}
        session={null}
      />,
    );

    expect(screen.getByTestId("shoe-size-40")).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  it("marks ShoeSizeOption as checked if in selectedSizes", () => {
    render(
      <ProductSizes
        product={baseProduct}
        selectedSizes={[40]}
        toggleSize={jest.fn()}
        session={mockSession}
      />,
    );

    expect(screen.getByTestId("shoe-size-40")).toHaveAttribute(
      "data-checked",
      "true",
    );
  });

  it("calls toggleSize when a ShoeSizeOption is clicked", () => {
    const mockToggle = jest.fn();
    render(
      <ProductSizes
        product={baseProduct}
        selectedSizes={[]}
        toggleSize={mockToggle}
        session={mockSession}
      />,
    );

    fireEvent.click(screen.getByTestId("shoe-size-40"));
    expect(mockToggle).toHaveBeenCalledWith(40);
  });

  it("renders fallback when no sizes available", () => {
    render(
      <ProductSizes
        product={{ ...baseProduct, sizes: [] }}
        selectedSizes={[]}
        toggleSize={jest.fn()}
        session={mockSession}
      />,
    );

    expect(screen.getByText("No sizes available")).toBeInTheDocument();
  });
});
