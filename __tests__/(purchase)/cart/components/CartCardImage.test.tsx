import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartCardImage from "../../../../src/app/(purchase)/cart/components/CartCardImage";
import { AllTheProviders } from "__tests__/utils/test-utils";

describe("CartCardImage", () => {
  const mockImageUrl = "https://example.com/test-image.jpg";
  const fallbackImageUrl = "/assets/images/placeholders/70x70.svg";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with provided image URL", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", mockImageUrl);
      expect(image).toHaveAttribute("alt", "product-img");
    });

    it("renders with fallback image when no image URL provided", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={undefined} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", fallbackImageUrl);
    });

    it("renders with fallback image when empty string provided", () => {
      render(
        <AllTheProviders>
          <CartCardImage image="" />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", fallbackImageUrl);
    });
  });

  describe("Error Handling", () => {
    it("switches to fallback image on load error", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveAttribute("src", mockImageUrl);

      fireEvent.error(image);

      expect(image).toHaveAttribute("src", fallbackImageUrl);
    });

    it("handles multiple error events gracefully", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });

      fireEvent.error(image);
      fireEvent.error(image);
      fireEvent.error(image);

      expect(image).toHaveAttribute("src", fallbackImageUrl);
    });
  });

  describe("Styling and Layout", () => {
    it("applies correct container styles", () => {
      const { container } = render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const imageContainer = container.firstChild as HTMLElement;
      expect(imageContainer).toHaveStyle({
        position: "relative",
        aspectRatio: "1/1",
      });
    });

    it("applies correct image styles", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveStyle({
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper alt text", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveAttribute("alt", "product-img");
    });

    it("maintains alt text after error fallback", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      fireEvent.error(image);

      expect(image).toHaveAttribute("alt", "product-img");
    });
  });

  describe("Edge Cases", () => {
    it("handles null image prop", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={null as any} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveAttribute("src", fallbackImageUrl);
    });

    it("handles whitespace-only image URL", () => {
      render(
        <AllTheProviders>
          <CartCardImage image="   " />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveAttribute("src", "   ");
    });

    it("handles very long image URLs", () => {
      const longUrl = "https://example.com/" + "a".repeat(1000) + ".jpg";
      render(
        <AllTheProviders>
          <CartCardImage image={longUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveAttribute("src", longUrl);
    });
  });

  describe("Component Structure", () => {
    it("renders with correct component hierarchy", () => {
      const { container } = render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const outerBox = container.firstChild;
      expect(outerBox).toBeInTheDocument();

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(outerBox).toContainElement(image);
    });

    it("renders only one image element", () => {
      render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(1);
    });
  });

  describe("Performance", () => {
    it("does not cause unnecessary re-renders with same props", () => {
      const { rerender } = render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      const initialSrc = image.getAttribute("src");

      rerender(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      expect(image.getAttribute("src")).toBe(initialSrc);
    });

    it("updates image source when prop changes", () => {
      const newImageUrl = "https://example.com/new-image.jpg";
      const { rerender } = render(
        <AllTheProviders>
          <CartCardImage image={mockImageUrl} />
        </AllTheProviders>
      );

      const image = screen.getByRole("img", { name: /product-img/i });
      expect(image).toHaveAttribute("src", mockImageUrl);

      rerender(
        <AllTheProviders>
          <CartCardImage image={newImageUrl} />
        </AllTheProviders>
      );

      expect(image).toHaveAttribute("src", newImageUrl);
    });
  });
});
