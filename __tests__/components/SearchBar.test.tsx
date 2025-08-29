import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";

afterEach(() => {
  cleanup();
});

describe("SearchBar component", () => {
  it("renders input with correct placeholder", () => {
    render(<SearchBar placeholder="Search test" />);
    const input = screen.getByPlaceholderText("Search test");
    expect(input).toBeInTheDocument();
  });

  it("handles onChange correctly", () => {
    const handleChange = jest.fn();
    render(<SearchBar onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("handles onSubmit correctly", () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(<SearchBar onSubmit={handleSubmit} />);
    const form = screen.getByPlaceholderText("Search").closest("form")!;
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("focuses input when focus prop is true", () => {
    render(<SearchBar focus placeholder="Search" />);
    const input = screen.getByPlaceholderText("Search");
    expect(document.activeElement).toBe(input);
  });

  it("renders different sizes without crashing", () => {
    const sizes: Array<"large" | "medium" | "small" | "xsmall"> = [
      "large",
      "medium",
      "small",
      "xsmall",
    ];

    sizes.forEach((size) => {
      render(<SearchBar size={size} />);
      const inputs = screen.getAllByRole("textbox");
      const input = inputs[inputs.length - 1];
      expect(input).toBeInTheDocument();
      cleanup();
    });
  });

  it("respects fullWidth prop without crashing", () => {
    render(<SearchBar fullWidth />);
    const input = screen.getByPlaceholderText("Search");
    expect(input).toBeInTheDocument();
  });
});
