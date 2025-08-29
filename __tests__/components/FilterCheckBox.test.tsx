import { render, screen, fireEvent } from "@testing-library/react";
import FilterCheckbox from "@/components/FilterCheckBox";

describe("FilterCheckbox", () => {
  it("renders the label correctly", () => {
    render(<FilterCheckbox label="Red" checked={false} onChange={() => {}} />);
    expect(screen.getByText("Red")).toBeInTheDocument();
  });

  it("renders the count if provided", () => {
    render(
      <FilterCheckbox
        label="Blue"
        checked={false}
        onChange={() => {}}
        count={10}
      />,
    );
    expect(screen.getByText(/Blue/i)).toBeInTheDocument();
  });

  it("does not render count if not provided", () => {
    render(
      <FilterCheckbox label="Green" checked={false} onChange={() => {}} />,
    );
    expect(screen.queryByText(/Green \d+/)).not.toBeInTheDocument();
  });

  it("checkbox reflects the checked prop", () => {
    const { rerender } = render(
      <FilterCheckbox label="Yellow" checked={true} onChange={() => {}} />,
    );
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    rerender(
      <FilterCheckbox label="Yellow" checked={false} onChange={() => {}} />,
    );
    expect(checkbox.checked).toBe(false);
  });

  it("calls onChange when checkbox is clicked", () => {
    const handleChange = jest.fn();
    render(
      <FilterCheckbox label="Orange" checked={false} onChange={handleChange} />,
    );
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders multiple checkboxes correctly", () => {
    render(
      <>
        <FilterCheckbox
          label="Small"
          checked={false}
          onChange={() => {}}
          count={5}
        />
        <FilterCheckbox
          label="Medium"
          checked={true}
          onChange={() => {}}
          count={8}
        />
      </>,
    );
    expect(screen.getByText(/Small/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
  });
});
