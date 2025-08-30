import { render, screen, fireEvent } from "@testing-library/react";
import { FilterSideBar } from "@/app/products/components/FiltersSideBar";
import { useRouter, useSearchParams } from "next/navigation";
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock("@/hooks/useMediaBreakpoints", () => jest.fn());

const mockReplace = jest.fn();
const mockHideDrawer = jest.fn();

const defaultProps = {
  hideDrawer: mockHideDrawer,
  paginationTotal: 10,
  brandOptions: [{ value: 1, label: "Nike" }],
  colorOptions: [{ value: 1, label: "Red" }],
  sizeOptions: [{ value: 42, label: 42 }],
  categoryOptions: [{ value: 1, label: "Sneakers" }],
};

describe("FilterSideBar simplified tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
      getAll: jest.fn(() => []),
      toString: jest.fn(() => ""),
    });
  });

  it("renders desktop view", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({ isMobile: false });
    render(<FilterSideBar {...defaultProps} />);
    expect(screen.getByText("Sneakers")).toBeInTheDocument();
    expect(screen.getByText("Clear All Filters")).toBeInTheDocument();
  });

  it("renders mobile view and calls hideDrawer", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({ isMobile: true });
    render(<FilterSideBar {...defaultProps} />);
    const closeIcon = screen.getByTestId("CloseIcon");
    fireEvent.click(closeIcon);
    expect(mockHideDrawer).toHaveBeenCalled();
  });

  it("toggles a checkbox filter", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({ isMobile: false });
    render(<FilterSideBar {...defaultProps} />);
    const brandCheckbox = screen.getByLabelText("Nike");
    fireEvent.click(brandCheckbox);
    expect(mockReplace).toHaveBeenCalled();
  });

  it("clears all filters", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({ isMobile: false });
    render(<FilterSideBar {...defaultProps} />);
    fireEvent.click(screen.getByText("Clear All Filters"));
    expect(mockReplace).toHaveBeenCalledWith("/products");
  });
});
