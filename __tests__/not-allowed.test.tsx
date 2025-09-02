import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NotAllowed from "@/app/not-allowed/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("NotAllowed Component", () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('renders the title "Ups!"', () => {
    render(<NotAllowed />);
    expect(screen.getByText("Ups!")).toBeInTheDocument();
  });

  test("renders the explanatory text", () => {
    render(<NotAllowed />);
    expect(
      screen.getByText(
        "You need to be logged in to access this page. Please login or sign up.",
      ),
    ).toBeInTheDocument();
  });

  test("renders the Log in button with correct link", () => {
    render(<NotAllowed />);
    const loginLink = screen.getByRole("link", { name: /Log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/sign-in");
  });

  test("renders the Home button with initial countdown", () => {
    render(<NotAllowed />);
    expect(
      screen.getByRole("button", { name: /Home \(15\)/i }),
    ).toBeInTheDocument();
  });

  test("decrements countdown every second", () => {
    render(<NotAllowed />);
    expect(
      screen.getByRole("button", { name: /Home \(15\)/i }),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.getByRole("button", { name: /Home \(14\)/i }),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(
      screen.getByRole("button", { name: /Home \(13\)/i }),
    ).toBeInTheDocument();
  });

  test("clicking Home button navigates to home immediately", () => {
    render(<NotAllowed />);
    const homeButton = screen.getByRole("button", { name: /Home \(\d+\)/i });
    fireEvent.click(homeButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  test("renders background elements", () => {
    render(<NotAllowed />);
    expect(screen.getByTestId("not-found-background")).toBeInTheDocument();
    expect(screen.getByTestId("not-found-extra-tile")).toBeInTheDocument();
  });

  test("clears interval on unmount", () => {
    const { unmount } = render(<NotAllowed />);
    const clearIntervalSpy = jest.spyOn(window, "clearInterval");
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
