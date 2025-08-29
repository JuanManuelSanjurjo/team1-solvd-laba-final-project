import {
  normalizeProduct,
  normalizeImages,
} from "@/lib/normalizers/product-normalizers";
import {
  ProductApiResponse,
  ImageData,
  NormalizedProduct,
  NormalizedImage,
} from "@/types/product-types";

const productMock: ProductApiResponse = {
  id: 1,
  attributes: {
    name: "Sneaker Air Max",
    description: "Comfortable running sneakers",
    price: 120,
    images: {
      data: [
        {
          id: 101,
          attributes: {
            url: "/images/products/airmax1.png",
            name: "Front view",
          },
        },
        {
          id: 102,
          attributes: {
            url: "/images/products/airmax2.png",
            name: "Side view",
          },
        },
      ],
    },
    sizes: {
      data: [
        { id: 42, attributes: { value: 42 } },
        { id: 43, attributes: { value: 43 } },
      ],
    },
    color: { data: { id: 1, attributes: { name: "Black" } } },
    gender: { data: { id: 2, attributes: { name: "Men" } } },
  },
};
describe("normalizeProduct", () => {
  it("normalizes a full product correctly", () => {
    const normalized: NormalizedProduct = normalizeProduct(productMock);
    expect(normalized).toEqual({
      id: 1,
      name: "Sneaker Air Max",
      description: "Comfortable running sneakers",
      price: 120,
      images: [
        { id: 101, url: "/images/products/airmax1.png", alt: "Front view" },
        { id: 102, url: "/images/products/airmax2.png", alt: "Side view" },
      ],
      sizes: [
        { id: 42, value: 42 },
        { id: 43, value: 43 },
      ],
      color: "Black",
      gender: "Men",
    });
  });

  it("falls back to defaults if some attributes missing", () => {
    const productWithoutAttributes: ProductApiResponse = {
      id: 2,
      attributes: {
        name: "",
        description: "",
        price: undefined as any,
        images: { data: [] },
        sizes: { data: [] },
        color: { data: null },
        gender: { data: null as any },
      },
    };

    const normalized = normalizeProduct(productWithoutAttributes);

    expect(normalized.name).toBe("No name");
    expect(normalized.description).toBe("No description");
    expect(normalized.price).toBe(0);
    expect(normalized.images).toEqual([]);
    expect(normalized.sizes).toEqual([]);
    expect(normalized.color).toBe("Not disclosed");
    expect(normalized.gender).toBeUndefined();
  });

  it("handles undefined images or sizes", () => {
    const productEmpty: ProductApiResponse = {
      id: 3,
      attributes: {
        name: "Empty Product",
        description: "",
        price: 50,
        images: { data: undefined as any },
        sizes: { data: undefined as any },
        color: { data: null },
        gender: { data: null as any },
      },
    };

    const normalized = normalizeProduct(productEmpty);

    expect(normalized.images).toBeUndefined();
    expect(normalized.sizes).toEqual([]);
  });
});

describe("normalizeImages", () => {
  const imagesMock: ImageData[] = [
    { id: 1, attributes: { url: "/img1.png", name: "Front" } },
    { id: 2, attributes: { url: "/img2.png", name: "Side" } },
  ];

  it("normalizes images correctly", () => {
    const normalized: NormalizedImage[] = normalizeImages(imagesMock);
    expect(normalized).toEqual([
      { id: 1, url: "/img1.png", alt: "Front" },
      { id: 2, url: "/img2.png", alt: "Side" },
    ]);
  });

  it("handles empty array", () => {
    const normalized = normalizeImages([]);
    expect(normalized).toEqual([]);
  });
});
