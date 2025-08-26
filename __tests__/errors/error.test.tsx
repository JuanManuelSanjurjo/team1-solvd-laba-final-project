import { render, screen } from "@testing-library/react";
import Error from "@/app/error";

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

describe("Error page", () => {
  it("renders ErrorPageFloatingContent with correct props", () => {
    render(<Error />);

    expect(screen.getByTestId("error-floating-content")).toBeInTheDocument();

    expect(screen.getByText("We lost that page")).toBeInTheDocument();
    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("renders background image box", () => {
    render(<Error />);
    const bgBox = screen.getByTestId("error-background");
    expect(bgBox).toHaveStyle(
      `background-image: url(/assets/images/404-page-bg.png)`,
    );
  });
});
