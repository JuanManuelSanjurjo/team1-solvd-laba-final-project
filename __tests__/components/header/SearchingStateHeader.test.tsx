import { render, screen, fireEvent } from "@testing-library/react";
import SearchingStateHeader from "@/components/header/SearchingStateHeader";

jest.mock("@/components/SearchBar", () => ({
  SearchBar: ({
    onChange,
    onSubmit,
    size,
    fullWidth,
  }: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    size: string;
    fullWidth: boolean;
  }) => (
    <form data-testid="search-bar" onSubmit={onSubmit}>
      <input
        data-testid="search-input"
        onChange={onChange}
        placeholder={`SearchBar size=${size} fullWidth=${fullWidth}`}
      />
      <button type="submit">submit</button>
    </form>
  ),
}));

jest.mock("@/components/LogoBlackSvg", () => ({
  LogoBlackSvg: () => <div data-testid="logo">Logo</div>,
}));

jest.mock("@/hooks/useMediaBreakpoints", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";

describe("SearchingStateHeader", () => {
  const defaultProps = {
    isSearching: false,
    handleSearchInputChange: jest.fn(),
    handleSearchSubmit: jest.fn((e) => e.preventDefault()),
    toggleSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the logo when NOT mobile", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
    });

    render(<SearchingStateHeader {...defaultProps} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("does NOT render the logo when mobile", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: true,
      isTablet: false,
    });

    render(<SearchingStateHeader {...defaultProps} />);
    expect(screen.queryByTestId("logo")).not.toBeInTheDocument();
  });

  it("passes the correct props to SearchBar on mobile", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: true,
      isTablet: false,
    });

    render(<SearchingStateHeader {...defaultProps} />);
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "shoes" } });

    expect(defaultProps.handleSearchInputChange).toHaveBeenCalled();
    expect(input).toHaveAttribute(
      "placeholder",
      "SearchBar size=xsmall fullWidth=true",
    );
  });

  it("passes the correct props to SearchBar on tablet", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: true,
    });

    render(<SearchingStateHeader {...defaultProps} />);
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "placeholder",
      "SearchBar size=medium fullWidth=false",
    );
  });

  it("passes the correct props to SearchBar on desktop", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
    });

    render(<SearchingStateHeader {...defaultProps} />);
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "placeholder",
      "SearchBar size=large fullWidth=false",
    );
  });

  it("calls handleSearchSubmit when submitting the form", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
    });

    render(<SearchingStateHeader {...defaultProps} />);
    fireEvent.submit(screen.getByTestId("search-bar"));
    expect(defaultProps.handleSearchSubmit).toHaveBeenCalled();
  });
});
