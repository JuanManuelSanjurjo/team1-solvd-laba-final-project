import { render, screen, fireEvent } from "@testing-library/react";
import CurrentFilters from "@/app/products/components/CurrentFilters";

const mockReplace = jest.fn();
let mockedParamsString = "";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(mockedParamsString),
}));

describe("CurrentFilters", () => {
  beforeEach(() => {
    mockedParamsString = "";
    mockReplace.mockClear();
  });

  it("renders 'No filters applied' when no filters and default price range", () => {
    render(<CurrentFilters priceRange={[0, 500]} setPriceRange={jest.fn()} />);

    expect(screen.getByText(/No filters applied/i)).toBeInTheDocument();
  });

  it("renders FilterChips for search params", () => {
    mockedParamsString = "brand=Nike&color=Red";

    render(<CurrentFilters priceRange={[0, 500]} setPriceRange={jest.fn()} />);

    expect(screen.getByText("Nike")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
  });

  it("renders a price filter chip when price range is active", () => {
    render(
      <CurrentFilters priceRange={[100, 300]} setPriceRange={jest.fn()} />,
    );

    expect(screen.getByText("Price: 100/300")).toBeInTheDocument();
  });

  it("removes a filter when clicking its chip", () => {
    mockedParamsString = "brand=Nike&color=Red";

    render(<CurrentFilters priceRange={[0, 500]} setPriceRange={jest.fn()} />);

    fireEvent.click(screen.getByText("Nike"));

    expect(mockReplace).toHaveBeenCalledWith("?color=Red");
  });

  it("resets price range when clicking price chip", () => {
    mockedParamsString = "brand=Adidas";
    const setPriceRange = jest.fn();

    render(
      <CurrentFilters priceRange={[50, 400]} setPriceRange={setPriceRange} />,
    );

    fireEvent.click(screen.getByText("Price: 50/400"));

    expect(mockReplace).toHaveBeenCalled();
    expect(setPriceRange).toHaveBeenCalledWith([0, 500]);
  });
});
