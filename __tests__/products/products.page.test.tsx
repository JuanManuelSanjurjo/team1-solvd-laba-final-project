import React from "react";
import { render, screen } from "@testing-library/react";
import ProductsPage, { metadata } from "@/app/products/page";
import { auth } from "@/auth";
import { fetchBrands } from "@/lib/actions/fetch-brands";
import { fetchColors } from "@/lib/actions/fetch-colors";
import { fetchSizes } from "@/lib/actions/fetch-sizes";
import { fetchCategories } from "@/lib/actions/fetch-categories";
import "@testing-library/jest-dom";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-brands", () => ({
  fetchBrands: jest.fn(),
}));
jest.mock("@/lib/actions/fetch-colors", () => ({
  fetchColors: jest.fn(),
}));
jest.mock("@/lib/actions/fetch-sizes", () => ({
  fetchSizes: jest.fn(),
}));
jest.mock("@/lib/actions/fetch-categories", () => ({
  fetchCategories: jest.fn(),
}));

jest.mock("@/components/Products", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="Products"
      data-brands={JSON.stringify(props.brandOptions)}
      data-colors={JSON.stringify(props.colorOptions)}
      data-sizes={JSON.stringify(props.sizeOptions)}
      data-categories={JSON.stringify(props.categoryOptions)}
      data-session={props.session ? "true" : "false"}
    />
  ),
}));

jest.mock("@/app/products/components/RecommendationPopUp", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="RecommendationPopup" data-userid={props.userId} />
  ),
}));

describe("ProductsPage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("loads options, passes them to <Products/>, and uses session.user.id for RecommendationPopup", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "u-123" } });

    (fetchBrands as jest.Mock).mockResolvedValue(["Nike", "Adidas"]);
    (fetchColors as jest.Mock).mockResolvedValue(["Black", "White"]);
    (fetchSizes as jest.Mock).mockResolvedValue(["M", "L"]);
    (fetchCategories as jest.Mock).mockResolvedValue(["Shoes", "Apparel"]);

    const jsx = await ProductsPage();
    render(jsx);

    expect(fetchBrands).toHaveBeenCalledTimes(1);
    expect(fetchColors).toHaveBeenCalledTimes(1);
    expect(fetchSizes).toHaveBeenCalledTimes(1);
    expect(fetchCategories).toHaveBeenCalledTimes(1);

    const products = screen.getByTestId("Products");
    expect(JSON.parse(products.getAttribute("data-brands")!)).toEqual([
      "Nike",
      "Adidas",
    ]);
    expect(JSON.parse(products.getAttribute("data-colors")!)).toEqual([
      "Black",
      "White",
    ]);
    expect(JSON.parse(products.getAttribute("data-sizes")!)).toEqual([
      "M",
      "L",
    ]);
    expect(JSON.parse(products.getAttribute("data-categories")!)).toEqual([
      "Shoes",
      "Apparel",
    ]);
    expect(products.getAttribute("data-session")).toBe("true");

    const popup = screen.getByTestId("RecommendationPopup");
    expect(popup.getAttribute("data-userid")).toBe("u-123");
  });

  it("falls back to userId='guest' when session or session.user.id is missing", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    (fetchBrands as jest.Mock).mockResolvedValue([]);
    (fetchColors as jest.Mock).mockResolvedValue([]);
    (fetchSizes as jest.Mock).mockResolvedValue([]);
    (fetchCategories as jest.Mock).mockResolvedValue([]);

    const jsx = await ProductsPage();
    render(jsx);

    const popup = screen.getByTestId("RecommendationPopup");
    expect(popup.getAttribute("data-userid")).toBe("guest");

    const products = screen.getByTestId("Products");
    expect(products.getAttribute("data-session")).toBe("false");
  });

  it("exports proper metadata.title", () => {
    expect(metadata.title).toBe("Products");
  });
});
