import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FiltersSection } from "@/app/products/components/FiltersSection";

describe("FiltersSection", () => {
  const setup = () =>
    render(
      <FiltersSection label="Sizes">
        <div>Child content</div>
      </FiltersSection>,
    );

  it("renders the label", () => {
    setup();
    expect(screen.getByText("Sizes")).toBeInTheDocument();
  });

  it("does not show children initially", () => {
    setup();
    expect(screen.queryByText("Child content")).not.toBeVisible();
  });

  it("expands and shows children on click", async () => {
    setup();

    const summary = screen.getByRole("button", { expanded: false });
    fireEvent.click(summary);

    await waitFor(() => {
      expect(screen.getByText("Child content")).toBeVisible();
    });
  });

  it("collapses and hides children on second click", async () => {
    setup();

    const summary = screen.getByRole("button", { expanded: false });
    fireEvent.click(summary);

    await waitFor(() =>
      expect(screen.getByText("Child content")).toBeVisible(),
    );

    fireEvent.click(summary);

    await waitFor(() =>
      expect(screen.getByText("Child content")).not.toBeVisible(),
    );
  });

  it("applies transition delay when expanded", async () => {
    setup();
    const summary = screen.getByRole("button", { expanded: false });

    fireEvent.click(summary);

    const inner = await screen.findByText("Child content");
    await waitFor(() => {
      expect(inner.parentElement).toHaveClass("filtersInner");
      expect(inner.parentElement).toHaveStyle("transition-delay: 200ms");
    });
  });
});
