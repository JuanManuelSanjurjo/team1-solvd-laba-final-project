import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/header/Header";
import useHeaderSearch from "@/hooks/useHeaderSearch";
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";
import { usePathname } from "next/navigation";

jest.mock("@mui/material", () => {
  const pickSafeProps = (props: any) => {
    const { onKeyDown, "data-testid": dataTestId, sx, ...rest } = props;
    const resolvedSx: any =
      typeof sx === "object" && sx !== null
        ? { height: sx.height, zIndex: sx.zIndex }
        : {};
    return { onKeyDown, dataTestId, resolvedSx, rest };
  };

  const AppBar = ({ children, ...props }: any) => {
    const { onKeyDown, resolvedSx } = pickSafeProps(props);
    return (
      <div
        data-testid="appbar"
        data-zindex={resolvedSx.zIndex ?? ""}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    );
  };

  const Toolbar = ({ children, ...props }: any) => {
    const { rest, resolvedSx } = pickSafeProps(props);
    let heightValue =
      resolvedSx.height ?? (rest && rest.sx && rest.sx.height) ?? "";

    if (typeof heightValue === "object" && heightValue !== null) {
      heightValue = heightValue.xs || "";
    }

    if (typeof heightValue === "string" && heightValue.endsWith("px")) {
      heightValue = heightValue.replace("px", "");
    }

    return (
      <div data-testid="toolbar" data-height={String(heightValue)}>
        {children}
      </div>
    );
  };

  return {
    __esModule: true,
    AppBar,
    Toolbar,
  };
});

jest.mock("@/components/header/SearchingStateHeader", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="searching-header"
      data-issearching={String(props.isSearching)}
      data-size={props.size}
    >
      SearchingHeader
    </div>
  ),
}));

jest.mock("@/components/header/NoSearchingStateHeader", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="no-search-header"
      data-handleToggleDrawer={String(Boolean(props.handleToggleDrawer))}
      data-toggleSearch={String(Boolean(props.toggleSearch))}
      data-session={props.session ? "true" : "false"}
    >
      NoSearchingHeader
    </div>
  ),
}));

jest.mock("@/components/header/SearchResultsPreview", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="search-results"
      data-aiLoading={String(props.aiLoading)}
      data-products={String((props.products || []).length)}
    >
      SearchResults
    </div>
  ),
}));

jest.mock("@/components/header/MobileDrawer", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="mobile-drawer"
      data-open={String(props.open)}
      data-session={props.session ? "true" : "false"}
    >
      MobileDrawer
    </div>
  ),
}));

jest.mock("@/hooks/useHeaderSearch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/hooks/useMediaBreakpoints", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Header", () => {
  const defaultHeaderHook = {
    isSearching: false,
    setIsSearching: jest.fn(),
    searchInput: "",
    toggleSearch: jest.fn(),
    handleEscapeKey: jest.fn(),
    handleSearchInputChange: jest.fn(),
    handleSearchSubmit: jest.fn(),
    handleToggleDrawer: jest.fn(),
    open: false,
    searchResults: [],
    generateFiltersWithAI: jest.fn(),
    aiLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useHeaderSearch as jest.Mock).mockReturnValue({ ...defaultHeaderHook });
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("returns null when pathname is an excluded auth path", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/sign-in");
    const { container } = render(<Header session={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders NoSearchingStateHeader when not searching", () => {
    (useHeaderSearch as jest.Mock).mockReturnValue({
      ...defaultHeaderHook,
      isSearching: false,
    });
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: true,
      isTablet: false,
    });

    render(<Header session={null} />);

    expect(screen.getByTestId("no-search-header")).toBeInTheDocument();

    const toolbar = screen.getByTestId("toolbar");
    expect(toolbar).toHaveAttribute("data-height", "60");

    const appbar = screen.getByTestId("appbar");
    expect(appbar).toHaveAttribute("data-zindex", "1200");
  });

  it("renders SearchingStateHeader when isSearching is true", () => {
    (useHeaderSearch as jest.Mock).mockReturnValue({
      ...defaultHeaderHook,
      isSearching: true,
      searchInput: "",
    });

    render(<Header session={null} />);

    expect(screen.getByTestId("searching-header")).toBeInTheDocument();

    expect(screen.getByTestId("appbar")).toHaveAttribute("data-zindex", "1205");
  });

  it("renders SearchResultsPreview when searching and searchInput has length > 0", () => {
    (useHeaderSearch as jest.Mock).mockReturnValue({
      ...defaultHeaderHook,
      isSearching: true,
      searchInput: "hello",
      searchResults: [{ id: 1 }, { id: 2 }],
      aiLoading: true,
    });

    render(<Header session={null} />);

    expect(screen.getByTestId("search-results")).toBeInTheDocument();
    expect(screen.getByTestId("search-results")).toHaveAttribute(
      "data-products",
      "2"
    );
    expect(screen.getByTestId("search-results")).toHaveAttribute(
      "data-aiLoading",
      "true"
    );
  });

  it("always renders MobileDrawer with correct open prop", () => {
    (useHeaderSearch as jest.Mock).mockReturnValue({
      ...defaultHeaderHook,
      open: true,
    });

    render(<Header session={null} />);

    const drawer = screen.getByTestId("mobile-drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("data-open", "true");
  });

  it("forwards handleEscapeKey to AppBar onKeyDown", () => {
    const mockHandleEscape = jest.fn();
    (useHeaderSearch as jest.Mock).mockReturnValue({
      ...defaultHeaderHook,
      handleEscapeKey: mockHandleEscape,
    });

    render(<Header session={null} />);

    const appbar = screen.getByTestId("appbar");
    fireEvent.keyDown(appbar, { key: "Escape", code: "Escape" });
    expect(mockHandleEscape).toHaveBeenCalled();
  });
});
