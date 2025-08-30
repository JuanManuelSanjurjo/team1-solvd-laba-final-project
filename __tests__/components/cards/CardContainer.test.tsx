import { render, screen } from "@testing-library/react";
import CardContainer from "@/components/cards/CardContainer";

describe("CardContainer", () => {
  it("renders children correctly", () => {
    render(
      <CardContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </CardContainer>,
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("applies correct justifyContent style when length is undefined", () => {
    const { container } = render(
      <CardContainer>
        <div>Child</div>
      </CardContainer>,
    );
    const box = container.firstChild as HTMLElement;
    expect(box).toHaveStyle({ justifyContent: "space-around" });
  });

  it("applies correct justifyContent style when length = 1", () => {
    const { container } = render(
      <CardContainer length={1}>
        <div>Child</div>
      </CardContainer>,
    );
    const box = container.firstChild as HTMLElement;
    expect(box).toHaveStyle({ justifyItems: "center" });
  });

  it("renders with multiple children and length > 2", () => {
    const { container } = render(
      <CardContainer length={3}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </CardContainer>,
    );
    const box = container.firstChild as HTMLElement;
    expect(box).toBeInTheDocument();
    expect(screen.getByText("Child 3")).toBeInTheDocument();
  });
});
