import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GalleryPage from "@/app/products/[product-id]/@gallery/page";
import { getProductImages } from "@/lib/actions/get-product-images";
import { normalizeImages } from "@/lib/normalizers/product-normalizers";

jest.mock("@/lib/actions/get-product-images", () => ({
  getProductImages: jest.fn(),
}));

jest.mock("@/lib/normalizers/product-normalizers", () => ({
  normalizeImages: jest.fn(),
}));

jest.mock("@/app/products//[product-id]/components/gallery/Gallery", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="Gallery" data-images={JSON.stringify(props.images)} />
  ),
}));

describe("GalleryPage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders Gallery with normalized images when API returns data", async () => {
    const apiData = [{ any: "shape" }];
    const normalized = [
      { id: 11, url: "https://img/11.jpg", alt: "a" },
      { id: 12, url: "https://img/12.jpg", alt: "b" },
    ];

    (getProductImages as jest.Mock).mockResolvedValue({ data: apiData });
    (normalizeImages as jest.Mock).mockReturnValue(normalized);

    const jsx = await GalleryPage({
      params: Promise.resolve({ "product-id": "123" }),
    });
    render(jsx);

    expect(getProductImages).toHaveBeenCalledWith("123");
    expect(normalizeImages).toHaveBeenCalledWith(apiData);

    const gallery = screen.getByTestId("Gallery");
    const images = JSON.parse(gallery.getAttribute("data-images")!);
    expect(images).toEqual(normalized);
  });

  it("falls back to default image when there are no images (data is null)", async () => {
    (getProductImages as jest.Mock).mockResolvedValue({ data: null });

    const jsx = await GalleryPage({
      params: Promise.resolve({ "product-id": "999" }),
    });
    render(jsx);

    const gallery = screen.getByTestId("Gallery");
    const images = JSON.parse(gallery.getAttribute("data-images")!);

    expect(getProductImages).toHaveBeenCalledWith("999");
    expect(normalizeImages).not.toHaveBeenCalled();

    expect(images).toEqual([
      { id: 0, url: "https://placehold.co/400", alt: "default" },
    ]);
  });

  it("also adds default image when normalizeImages returns an empty array", async () => {
    (getProductImages as jest.Mock).mockResolvedValue({ data: [{ x: 1 }] });
    (normalizeImages as jest.Mock).mockReturnValue([]);

    const jsx = await GalleryPage({
      params: Promise.resolve({ "product-id": "42" }),
    });
    render(jsx);

    const gallery = screen.getByTestId("Gallery");
    const images = JSON.parse(gallery.getAttribute("data-images")!);

    expect(getProductImages).toHaveBeenCalledWith("42");
    expect(normalizeImages).toHaveBeenCalled();

    expect(images).toEqual([
      { id: 0, url: "https://placehold.co/400", alt: "default" },
    ]);
  });
});
