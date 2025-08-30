import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "../../../../utils/test-utils";
import Gallery from "@/app/products/[product-id]/components/gallery/Gallery";
import { NormalizedImage } from "@/types/product-types";

jest.mock(
  "@/app/products/[product-id]/components/gallery/GalleryImageStack",
  () => {
    return function MockGalleryImageStack({
      images,
      current,
      setCurrent,
    }: {
      images: NormalizedImage[];
      current: number;
      setCurrent: (index: number) => void;
    }) {
      return (
        <div data-testid="gallery-image-stack">
          {images.map((image, index) => (
            <div
              key={image.id}
              data-testid={`thumbnail-${index}`}
              onClick={() => setCurrent(index)}
              style={{ border: index === current ? "2px solid red" : "none" }}
            >
              <img src={image.url} alt={image.alt} />
            </div>
          ))}
        </div>
      );
    };
  },
);

jest.mock("@/components/NavigationArrows", () => {
  return function MockNavigationArrows({
    handleNext,
    handlePrev,
  }: {
    handleNext?: () => void;
    handlePrev?: () => void;
  }) {
    return (
      <div data-testid="navigation-arrows">
        <button data-testid="prev-button" onClick={handlePrev}>
          Prev
        </button>
        <button data-testid="next-button" onClick={handleNext}>
          Next
        </button>
      </div>
    );
  };
});

describe("Gallery Component", () => {
  const mockImages: NormalizedImage[] = [
    { id: 1, url: "/image1.jpg", alt: "Image 1" },
    { id: 2, url: "/image2.jpg", alt: "Image 2" },
    { id: 3, url: "/image3.jpg", alt: "Image 3" },
  ];

  it("renders the gallery with images", () => {
    render(<Gallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();

    expect(screen.getByTestId("gallery-image-stack")).toBeInTheDocument();

    expect(screen.getByTestId("navigation-arrows")).toBeInTheDocument();
  });

  it("displays the correct number of thumbnails", () => {
    render(<Gallery images={mockImages} />);

    mockImages.forEach((_, index) => {
      expect(screen.getByTestId(`thumbnail-${index}`)).toBeInTheDocument();
    });
  });

  it("changes the main image when a thumbnail is clicked", () => {
    render(<Gallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("thumbnail-1"));

    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    expect(screen.queryByAltText("Image 1")).toBeInTheDocument();
  });

  it("cycles to the next image when next button is clicked", () => {
    render(<Gallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
  });

  it("cycles to the previous image when prev button is clicked", () => {
    render(<Gallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("prev-button"));

    expect(screen.getByAltText("Image 3")).toBeInTheDocument();
  });

  it("wraps around to the first image when next is clicked on the last image", () => {
    render(<Gallery images={mockImages} />);

    fireEvent.click(screen.getByTestId("next-button"));
    fireEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByAltText("Image 3")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("wraps around to the last image when prev is clicked on the first image", () => {
    render(<Gallery images={mockImages} />);

    expect(screen.getByAltText("Image 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("prev-button"));

    expect(screen.getByAltText("Image 3")).toBeInTheDocument();
  });
});
