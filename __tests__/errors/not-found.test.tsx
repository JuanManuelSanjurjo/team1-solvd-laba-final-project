import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

jest.mock("@/components/errors/ErrorPageFloatingContent", () => {
  return function MockErrorPageFloatingContent(props: {
    title: string;
    textContent: string;
    type: string;
  }) {
    return (
      <div data-testid="error-floating-content" {...props}>
        <h2>{props.title}</h2>
        <p>{props.textContent}</p>
        <span>{props.type}</span>
      </div>
    );
  };
});

describe("NotFound page", () => {
  it("renders ErrorPageFloatingContent with correct props", () => {
    render(<NotFound />);

    const floating = screen.getByTestId("error-floating-content");

    expect(floating).toBeInTheDocument();
    expect(floating).toHaveAttribute("title", "Error 404");
    expect(floating).toHaveTextContent(
      "The page you were looking for doesn't exist. Try going back or searching for other products.",
    );
    expect(floating).toHaveAttribute("type", "not-found");
  });

  it("renders background image box with correct style", () => {
    render(<NotFound />);

    const bgBox = screen.getByTestId("not-found-background");

    expect(bgBox).toHaveStyle(`background: white`);

    expect(bgBox).toHaveStyle(`overflow: hidden`);
  });

  it("renders extra tile for xs breakpoint", () => {
    render(<NotFound />);
    const tile = screen.getByTestId("not-found-extra-tile");
    expect(tile).toBeInTheDocument();
  });
});
