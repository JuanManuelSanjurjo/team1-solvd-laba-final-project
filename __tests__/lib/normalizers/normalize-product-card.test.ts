import {
  normalizeProductCard,
  normalizeMyProductCard,
  normalizeFullProduct,
  normalizeProductToMyProduct,
} from "@lib/normalizers/normalize-product-card";
import { myProductMock, completeProductResponse } from "@/mocks/product";
import { Product, MyProduct } from "@/types/product";

describe("normalize-product-card", () => {
  describe("normalizeProductCard", () => {
    it("normalizes Product into card format", () => {
      const normalized = normalizeProductCard([completeProductResponse]);

      expect(normalized).toEqual([
        {
          id: 123,
          image: "https://example.com/images/product-123-1.jpg",
          name: "Classic Sneaker",
          price: 7999,
          gender: "Unisex",
          sizes: [38, 39, 40],
        },
      ]);
    });

    it("falls back to placeholder if no images", () => {
      const productWithoutImages: Product = {
        ...completeProductResponse,
        attributes: {
          ...completeProductResponse.attributes,
          images: { data: null },
        },
      };

      const normalized = normalizeProductCard([productWithoutImages]);

      expect(normalized[0].image).toBe(
        "/assets/images/placeholders/400x400.svg",
      );
    });
  });

  describe("normalizeMyProductCard", () => {
    it("normalizes MyProduct into card format", () => {
      const normalized = normalizeMyProductCard([myProductMock]);

      expect(normalized).toEqual([
        {
          id: 1,
          image: "/images/products/airmax1.png",
          name: "Sneaker Air Max",
          price: 120,
          gender: "Men",
        },
      ]);
    });

    it("falls back to placeholder if no images", () => {
      const productWithoutImages: MyProduct = {
        ...myProductMock,
        images: [],
        sizes: [],
      };
      const normalized = normalizeMyProductCard([productWithoutImages]);

      expect(normalized[0].image).toBe(
        "/assets/images/placeholders/400x400.svg",
      );
    });
  });

  describe("normalizeFullProduct", () => {
    it("normalizes a full Product correctly", () => {
      const normalized = normalizeFullProduct(completeProductResponse);

      expect(normalized).toEqual({
        id: 123,
        image: "https://example.com/images/product-123-1.jpg",
        name: "Classic Sneaker",
        price: 7999,
        gender: "Unisex",
        brand: "Acme Shoes",
        color: "Black",
        category: "Sneakers",
      });
    });

    it("falls back to defaults if optional fields missing", () => {
      const productNoData: Product = {
        ...completeProductResponse,
        attributes: {
          ...completeProductResponse.attributes,
          brand: { data: null },
          color: { data: null },
          categories: { data: null },
          gender: { data: null as any },
        },
      };

      const normalized = normalizeFullProduct(productNoData);

      expect(normalized.brand).toBe("No brand");
      expect(normalized.color).toBe("No brand");
      expect(normalized.category).toBe("No category");
      expect(normalized.gender).toBe("No gender");
    });
  });

  describe("normalizeProductToMyProduct", () => {
    it("converts Product into MyProduct format", () => {
      const myProduct = normalizeProductToMyProduct(completeProductResponse);

      expect(myProduct).toEqual({
        id: 123,
        name: "Classic Sneaker",
        price: 7999,
        description: "A comfortable, everyday sneaker with a timeless design.",
        categories: [
          { id: 21, name: "Sneakers" },
          { id: 22, name: "Casual" },
        ],
        gender: { id: 1, name: "Unisex" },
        images: [
          { id: 11, url: "https://example.com/images/product-123-1.jpg" },
          { id: 12, url: "https://example.com/images/product-123-2.jpg" },
        ],
        sizes: [{ id: 31 }, { id: 32 }, { id: 33 }],
        brand: { id: 2 },
        color: { id: 3 },
      });
    });
  });
  describe("normalize-product-card - branch coverage", () => {
    it("uses placeholder if images.data is empty array", () => {
      const productWithEmptyImages: Product = {
        ...completeProductResponse,
        attributes: {
          ...completeProductResponse.attributes,
          images: { data: [] },
        },
      };
      const normalized = normalizeProductCard([productWithEmptyImages]);
      expect(normalized[0].image).toBe(
        "/assets/images/placeholders/400x400.svg",
      );
    });

    it("falls back to 'No gender' if gender.attributes.name is undefined", () => {
      const productNoGenderName: Product = {
        ...completeProductResponse,
        attributes: {
          ...completeProductResponse.attributes,
          gender: { data: { id: 1, attributes: { name: undefined as any } } },
        },
      };
      const normalized = normalizeProductCard([productNoGenderName]);
      expect(normalized[0].gender).toBe("No gender");
    });

    it("falls back to empty array if sizes.data is null", () => {
      const productNoSizes: Product = {
        ...completeProductResponse,
        attributes: {
          ...completeProductResponse.attributes,
          sizes: { data: null },
        },
      };
      const normalized = normalizeProductCard([productNoSizes]);
      expect(normalized[0].sizes).toEqual([]);
    });

    it("normalizeProductToMyProduct handles null or empty fields", () => {
      const productEdgeCase: Product = {
        ...completeProductResponse,
        attributes: {
          ...completeProductResponse.attributes,
          images: { data: null },
          sizes: { data: null },
          categories: { data: null },
          brand: { data: null },
          color: { data: null },
          gender: { data: null as any },
        },
      };

      const myProduct = normalizeProductToMyProduct(productEdgeCase);
      expect(myProduct.images).toEqual([]);
      expect(myProduct.sizes).toEqual([]);
      expect(myProduct.categories).toEqual([]);
      expect(myProduct.brand).toEqual({ id: 0 });
      expect(myProduct.color).toEqual({ id: 0 });
      expect(myProduct.gender).toEqual({ id: 0, name: "No gender" });
    });
  });
});
