import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SingleProduct, {
  generateMetadata,
} from "@/app/products/[product-id]/@productDetails/page";
import { auth } from "@/auth";
import { getProductName } from "@/lib/actions/get-product-name";
import { getProductDetails } from "@/lib/actions/get-product-details";
import { normalizeProduct } from "@/lib/normalizers/product-normalizers";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/actions/get-product-name", () => ({
  getProductName: jest.fn(),
}));
jest.mock("@/lib/actions/get-product-details", () => ({
  getProductDetails: jest.fn(),
}));
jest.mock("@/lib/normalizers/product-normalizers", () => ({
  normalizeProduct: jest.fn(),
}));

jest.mock("@/app/products/[product-id]/components/ProductPageDetails", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="ProductPageDetails"
      data-session={props.session ? "true" : "false"}
      data-product={JSON.stringify(props.product)}
    />
  ),
}));

describe("SingleProduct page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("generateMetadata", () => {
    it("returns 'Products | <name>' when product name exists", async () => {
      (getProductName as jest.Mock).mockResolvedValue({
        data: { attributes: { name: "Air Max 97" } },
      });

      const meta = await generateMetadata({
        params: Promise.resolve({ "product-id": "123" }),
      });

      expect(getProductName).toHaveBeenCalledWith("123");
      expect(meta.title).toBe("Products | Air Max 97");
      expect(meta.description).toBe("Product details");
    });

    it("falls back to default title when name is missing", async () => {
      (getProductName as jest.Mock).mockResolvedValue({ data: null });

      const meta = await generateMetadata({
        params: Promise.resolve({ "product-id": "999" }),
      });

      expect(getProductName).toHaveBeenCalledWith("999");
      expect(meta.title).toBe("Product | Details");
      expect(meta.description).toBe("Product details");
    });
  });

  describe("SingleProduct", () => {
    it("fetches details, normalizes, and passes session + product to ProductPageDetails", async () => {
      const session = { user: { id: "u-7" } };
      (auth as jest.Mock).mockResolvedValue(session);

      const apiData = { id: 123, attributes: { name: "Test Shoe" } };
      (getProductDetails as jest.Mock).mockResolvedValue({ data: apiData });

      const normalized = { id: 123, name: "Test Shoe", price: 199 };
      (normalizeProduct as jest.Mock).mockReturnValue(normalized);

      const jsx = await SingleProduct({
        params: Promise.resolve({ "product-id": "123" }),
      });
      render(jsx);

      expect(auth).toHaveBeenCalled();
      expect(getProductDetails).toHaveBeenCalledWith("123");
      expect(normalizeProduct).toHaveBeenCalledWith(apiData);

      const node = screen.getByTestId("ProductPageDetails");
      expect(node).toBeInTheDocument();
      expect(node.getAttribute("data-session")).toBe("true");
      expect(JSON.parse(node.getAttribute("data-product")!)).toEqual(
        normalized
      );
    });
  });
});
