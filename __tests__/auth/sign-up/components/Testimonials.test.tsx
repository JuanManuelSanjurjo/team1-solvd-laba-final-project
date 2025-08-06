import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "../../../utils/test-utils";
import Testimonials from "@/app/auth/sign-up/components/Testimonials";

jest.mock("@/components/NavigationArrows", () => {
  return function MockNavigationArrows({
    handleNext,
    handlePrev,
    variant,
  }: any) {
    return (
      <div data-testid="navigation-arrows">
        <button onClick={handlePrev} data-testid="prev-button">
          Previous
        </button>
        <button onClick={handleNext} data-testid="next-button">
          Next
        </button>
        <span data-testid="variant">{variant}</span>
      </div>
    );
  };
});

jest.mock("@/mocks/testimonials", () => ({
  testimonials: [
    {
      clientName: "Test User 1",
      stars: 5,
      countryCity: "Test Country, Test City",
      testimonial: "This is a test testimonial 1",
    },
    {
      clientName: "Test User 2",
      stars: 4,
      countryCity: "Test Country 2, Test City 2",
      testimonial: "This is a test testimonial 2",
    },
  ],
}));

describe("Testimonials Component", () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders testimonial content correctly", () => {
      render(<Testimonials />);

      expect(
        screen.getByText("This is a test testimonial 1")
      ).toBeInTheDocument();
      expect(screen.getByText("Test User 1")).toBeInTheDocument();
      expect(screen.getByText("Test Country, Test City")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: /5 stars/i })).toBeInTheDocument();
      expect(screen.getByTestId("navigation-arrows")).toBeInTheDocument();
    });

    it("passes variant prop to NavigationArrows", () => {
      render(<Testimonials variant="testimonials" />);
      expect(screen.getByTestId("variant")).toHaveTextContent("testimonials");
    });
  });

  describe("Behavior", () => {
    it("navigates between testimonials with buttons", () => {
      render(<Testimonials />);

      expect(
        screen.getByText("This is a test testimonial 1")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("next-button"));
      expect(
        screen.getByText("This is a test testimonial 2")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("prev-button"));
      expect(
        screen.getByText("This is a test testimonial 1")
      ).toBeInTheDocument();
    });

    it("wraps around when navigating from last to first testimonial", () => {
      render(<Testimonials />);

      fireEvent.click(screen.getByTestId("next-button"));
      expect(
        screen.getByText("This is a test testimonial 2")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("next-button"));
      expect(
        screen.getByText("This is a test testimonial 1")
      ).toBeInTheDocument();
    });

    it("wraps around when navigating from first to last testimonial", () => {
      render(<Testimonials />);

      expect(
        screen.getByText("This is a test testimonial 1")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("prev-button"));
      expect(
        screen.getByText("This is a test testimonial 2")
      ).toBeInTheDocument();
    });

    it("auto-advances testimonials", async () => {
      render(<Testimonials />);

      expect(
        screen.getByText("This is a test testimonial 1")
      ).toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      expect(
        screen.getByText("This is a test testimonial 2")
      ).toBeInTheDocument();
    });

    it("cleans up interval on unmount", async () => {
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");
      const { unmount } = render(<Testimonials />);

      await act(async () => {
        unmount();
      });

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
