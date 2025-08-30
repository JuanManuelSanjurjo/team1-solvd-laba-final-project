import { render, screen, fireEvent, act } from "@testing-library/react";
import { FilterSectionWithSearch } from "@/app/products/components/FilterSectionWithSearch";

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    getAll: (key: string) => (key === "brand" ? ["Adidas"] : []),
  }),
}));

jest.mock("@/components/SearchBar", () => ({
  SearchBar: ({ onChange, placeholder }: any) => (
    <input
      placeholder={placeholder}
      onChange={onChange}
      data-testid="searchbar"
    />
  ),
}));

jest.mock("@/components/FilterCheckBox", () => (props: any) => (
  <div>
    <label>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      {props.label}
    </label>
  </div>
));

jest.mock("@/app/products/components/FiltersSection", () => ({
  FiltersSection: ({ children, label }: any) => (
    <section>
      <h2>{label}</h2>
      {children}
    </section>
  ),
}));

describe("FilterSectionWithSearch", () => {
  const defaultProps = {
    label: "Brand",
    filterKey: "brand",
    options: [
      { value: 1, label: "Nike" },
      { value: 2, label: "Adidas" },
    ],
    onFilterChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders section with label", () => {
    render(<FilterSectionWithSearch {...defaultProps} />);
    expect(screen.getByText("Brand")).toBeInTheDocument();
  });

  it("renders search bar when showSearch is true", () => {
    render(<FilterSectionWithSearch {...defaultProps} showSearch />);
    expect(screen.getByTestId("searchbar")).toBeInTheDocument();
  });

  it("does not render search bar when showSearch is false", () => {
    render(<FilterSectionWithSearch {...defaultProps} showSearch={false} />);
    expect(screen.queryByTestId("searchbar")).not.toBeInTheDocument();
  });

  it("filters options based on search input", () => {
    jest.useFakeTimers();
    render(<FilterSectionWithSearch {...defaultProps} />);
    const input = screen.getByTestId("searchbar");

    fireEvent.change(input, { target: { value: "Nike" } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText("Nike")).toBeInTheDocument();
    expect(screen.queryByText("Adidas")).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("calls onFilterChange when an option is clicked", () => {
    render(<FilterSectionWithSearch {...defaultProps} />);
    const checkbox = screen.getByLabelText("Nike");
    fireEvent.click(checkbox);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("brand", "Nike");
  });

  it("respects custom checked prop", () => {
    const checkedMock = (val: string) => val === "Nike";
    render(<FilterSectionWithSearch {...defaultProps} checked={checkedMock} />);

    expect(screen.getByLabelText("Nike")).toBeChecked();
    expect(screen.getByLabelText("Adidas")).not.toBeChecked();
  });

  it("falls back to searchParams when no checked prop provided", () => {
    render(<FilterSectionWithSearch {...defaultProps} />);
    expect(screen.getByLabelText("Adidas")).toBeChecked();
    expect(screen.getByLabelText("Nike")).not.toBeChecked();
  });
});
