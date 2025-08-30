import { render, screen, fireEvent } from "@testing-library/react";
import FilterChip from "@/app/products/components/FilterChip";

describe("FilterChip", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders the given text", () => {
    render(<FilterChip text="Nike" onClick={mockOnClick} />);

    expect(screen.getByText("Nike")).toBeInTheDocument();
  });

  it("renders the Add icon with correct rotation", () => {
    render(<FilterChip text="Adidas" onClick={mockOnClick} />);

    const icon = screen.getByText("Adidas").nextSibling;
    expect(icon).toHaveStyle({ transform: "rotate(45deg)" });
  });

  it("calls onClick when clicked", () => {
    render(<FilterChip text="Puma" onClick={mockOnClick} />);

    fireEvent.click(screen.getByText("Puma"));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has pointer cursor style", () => {
    render(<FilterChip text="Reebok" onClick={mockOnClick} />);

    const chip = screen.getByText("Reebok").closest("div");
    expect(chip).toHaveStyle({ cursor: "pointer" });
  });
});
