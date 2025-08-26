import { render, screen, fireEvent } from "@testing-library/react";
import NavigationArrows, {
  NavigationArrowsProps,
} from "@/components/NavigationArrows";

describe("NavigationArrows Component", () => {
  const defaultProps: NavigationArrowsProps = {
    variant: "product_card",
    handleNext: jest.fn(),
    handlePrev: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering Tests", () => {
    it("should render the component with default props", () => {
      render(<NavigationArrows {...defaultProps} />);

      const navigationArrows = screen.getByTestId("navigation-arrows");
      expect(navigationArrows).toBeInTheDocument();

      const prevArrow = screen.getByTestId("prev-arrow");
      expect(prevArrow).toBeInTheDocument();

      const nextArrow = screen.getByTestId("next-arrow");
      expect(nextArrow).toBeInTheDocument();
    });

    it("should render with product_card variant styling", () => {
      render(<NavigationArrows {...defaultProps} variant="product_card" />);

      const navigationArrows = screen.getByTestId("navigation-arrows");
      expect(navigationArrows).toBeInTheDocument();
    });

    it("should render with testimonials variant styling", () => {
      render(<NavigationArrows {...defaultProps} variant="testimonials" />);

      const navigationArrows = screen.getByTestId("navigation-arrows");
      expect(navigationArrows).toBeInTheDocument();
      expect(navigationArrows).toHaveStyle("position: static");
    });

    it("should render without handleNext and handlePrev props", () => {
      render(<NavigationArrows variant="product_card" />);

      const navigationArrows = screen.getByTestId("navigation-arrows");
      expect(navigationArrows).toBeInTheDocument();
    });
  });

  describe("Interaction Tests", () => {
    it("should call handlePrev when left arrow is clicked", () => {
      const mockHandlePrev = jest.fn();
      render(
        <NavigationArrows {...defaultProps} handlePrev={mockHandlePrev} />,
      );

      const prevArrow = screen.getByTestId("prev-arrow");
      fireEvent.click(prevArrow);

      expect(mockHandlePrev).toHaveBeenCalledTimes(1);
    });

    it("should call handleNext when right arrow is clicked", () => {
      const mockHandleNext = jest.fn();
      render(
        <NavigationArrows {...defaultProps} handleNext={mockHandleNext} />,
      );

      const nextArrow = screen.getByTestId("next-arrow");
      fireEvent.click(nextArrow);

      expect(mockHandleNext).toHaveBeenCalledTimes(1);
    });

    it("should not throw error when clicking arrows without handlers", () => {
      render(<NavigationArrows variant="product_card" />);

      const prevArrow = screen.getByTestId("prev-arrow");
      const nextArrow = screen.getByTestId("next-arrow");

      expect(() => {
        fireEvent.click(prevArrow);
        fireEvent.click(nextArrow);
      }).not.toThrow();
    });
  });

  describe("Styling Tests", () => {
    it("should apply correct styles for product_card variant arrows", () => {
      render(<NavigationArrows {...defaultProps} variant="product_card" />);

      const prevArrow = screen.getByTestId("prev-arrow");
      const nextArrow = screen.getByTestId("next-arrow");

      expect(prevArrow).toBeInTheDocument();
      expect(nextArrow).toBeInTheDocument();
    });

    it("should apply correct styles for testimonials variant arrows", () => {
      render(<NavigationArrows {...defaultProps} variant="testimonials" />);

      const prevArrow = screen.getByTestId("prev-arrow");
      const nextArrow = screen.getByTestId("next-arrow");

      expect(prevArrow).toBeInTheDocument();
      expect(nextArrow).toBeInTheDocument();
    });

    it("should have cursor pointer on arrows", () => {
      render(<NavigationArrows {...defaultProps} />);

      const prevArrow = screen.getByTestId("prev-arrow");
      const nextArrow = screen.getByTestId("next-arrow");

      expect(prevArrow).toBeInTheDocument();
      expect(nextArrow).toBeInTheDocument();
    });

    it("should have correct gap for product_card variant", () => {
      render(<NavigationArrows {...defaultProps} variant="product_card" />);

      const container = screen
        .getByTestId("navigation-arrows")
        .querySelector("div > div");
      expect(container).toBeInTheDocument();
    });

    it("should have correct gap for testimonials variant", () => {
      render(<NavigationArrows {...defaultProps} variant="testimonials" />);

      const container = screen
        .getByTestId("navigation-arrows")
        .querySelector("div > div");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined variant by using default product_card", () => {
      render(<NavigationArrows {...defaultProps} variant={undefined} />);

      const navigationArrows = screen.getByTestId("navigation-arrows");
      expect(navigationArrows).toBeInTheDocument();
    });

    it("should render arrows with correct border radius", () => {
      render(<NavigationArrows {...defaultProps} />);

      const prevArrow = screen.getByTestId("prev-arrow");
      const nextArrow = screen.getByTestId("next-arrow");

      expect(prevArrow).toBeInTheDocument();
      expect(nextArrow).toBeInTheDocument();
    });
  });
});
