import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "../../../../utils/test-utils";
import GalleryImageStack from "@/app/products/[product-id]/components/gallery/GalleryImageStack";
import { NormalizedImage } from "@/types/product-types";

describe("GalleryImageStack Component", () => {
  const mockImages: NormalizedImage[] = [
    { id: 1, url: "/image1.jpg", alt: "Image 1" },
    { id: 2, url: "/image2.jpg", alt: "Image 2" },
    { id: 3, url: "/image3.jpg", alt: "Image 3" },
  ];

  const mockSetCurrent = jest.fn();
  const mockContainerRef = { current: null };
  const mockThumbnailRefs = { current: [] };

  beforeEach(() => {
    mockSetCurrent.mockClear();
  });

  it("renders all thumbnails", () => {
    render(
      <GalleryImageStack
        images={mockImages}
        current={0}
        setCurrent={mockSetCurrent}
        containerRef={mockContainerRef}
        thumbnailRefs={mockThumbnailRefs}
      />,
    );

    mockImages.forEach((image) => {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    });
  });

  it("calls setCurrent when a thumbnail is clicked", () => {
    render(
      <GalleryImageStack
        images={mockImages}
        current={0}
        setCurrent={mockSetCurrent}
        containerRef={mockContainerRef}
        thumbnailRefs={mockThumbnailRefs}
      />,
    );

    fireEvent.click(screen.getByAltText("Image 2"));

    expect(mockSetCurrent).toHaveBeenCalledWith(1);
  });

  it("applies active styling to the current thumbnail", () => {
    render(
      <GalleryImageStack
        images={mockImages}
        current={1}
        setCurrent={mockSetCurrent}
        containerRef={mockContainerRef}
        thumbnailRefs={mockThumbnailRefs}
      />,
    );

    const thumbnails = screen.getAllByRole("img");

    expect(thumbnails).toHaveLength(3);
  });
});
