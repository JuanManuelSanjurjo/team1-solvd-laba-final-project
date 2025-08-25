import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPageFloatingContent from "@/components/errors/ErrorPageFloatingContent";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ErrorPageFloatingContent", () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
    jest.clearAllMocks();
  });

  it("renders title and text content", () => {
    render(
      <ErrorPageFloatingContent
        title="Page not found"
        text="The page you are looking for does not exist."
        type="not-found"
      />,
    );

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for does not exist."),
    ).toBeInTheDocument();
  });

  it('adds "..." to title when type is error', () => {
    render(
      <ErrorPageFloatingContent
        title="Something went wrong"
        text="Try again later"
        type="error"
      />,
    );

    const title = screen.getByText("Something went wrong");
    expect(title).toBeInTheDocument();
  });

  it("calls router.back when clicking Go back", () => {
    render(
      <ErrorPageFloatingContent
        title="Error"
        text="Some error happened"
        type="error"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /go back/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it("renders a link to home in Go home button", () => {
    render(
      <ErrorPageFloatingContent
        title="Not found"
        text="Page missing"
        type="not-found"
      />,
    );

    const homeButton = screen.getByRole("link", { name: /go home/i });
    expect(homeButton).toHaveAttribute("href", "/");
  });
});
