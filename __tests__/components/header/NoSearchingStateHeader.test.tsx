import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoSearchingStateHeader from "@/components/header/NoSearchingStateHeader";
import { useCartStore } from "@/store/cart-store";

jest.mock("@/components/SearchBar", () => ({
  SearchBar: ({ size }: any) => <div data-testid={`searchbar-${size}`} />,
}));

jest.mock("@/components/LogoBlackSvg", () => ({
  LogoBlackSvg: () => <div data-testid="logo">Logo</div>,
}));

jest.mock("@/components/header/DesktopProfileMenu", () => ({
  __esModule: true,
  default: ({ session }: any) => (
    <div data-testid="desktop-profile-menu">
      Profile Menu-{session?.user?.id}
    </div>
  ),
}));

jest.mock("iconsax-react", () => ({
  __esModule: true,
  Bag: (props: any) => <svg data-testid="bag-icon" {...props} />,
  SearchNormal: (props: any) => <svg data-testid="search-icon" {...props} />,
}));

jest.mock("@/hooks/useMediaBreakpoints", () => ({
  __esModule: true,
  default: jest.fn(),
}));
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";

jest.mock("@/store/cart-store", () => ({
  useCartStore: jest.fn(),
}));

jest.mock("@mui/material", () => {
  const Box = ({ children, component, href, onClick, ...props }: any) => {
    return (
      <div
        data-testid={props["data-testid"]}
        href={href}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  };
  const Tooltip = ({ children }: any) => <span>{children}</span>;
  const Button = ({ children, href, ...props }: any) => (
    <a data-testid="button" href={href} {...props}>
      {children}
    </a>
  );
  const IconButton = ({ children, onClick, "aria-label": ariaLabel }: any) => (
    <button data-testid="icon-button" aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
  const Badge = ({ badgeContent, invisible, children }: any) => (
    <div data-testid="badge" data-badge={invisible ? "" : badgeContent}>
      {children}
    </div>
  );
  return { Box, Tooltip, Button, Badge, IconButton };
});

describe("NoSearchingStateHeader", () => {
  const mockToggleSearch = jest.fn();
  const mockHandleToggleDrawer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ totalItems: () => 5 }),
    );
  });

  it("renders the logo and search bar when desktop", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });

    render(
      <NoSearchingStateHeader
        session={null}
        toggleSearch={mockToggleSearch}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    expect(screen.getByTestId("logo")).toBeInTheDocument();

    expect(screen.getByTestId("searchbar-medium")).toBeInTheDocument();
  });

  it("renders the search icon when not desktop", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });

    render(
      <NoSearchingStateHeader
        session={null}
        toggleSearch={mockToggleSearch}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("shows sign-in button when not authenticated", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });

    render(
      <NoSearchingStateHeader
        session={null}
        toggleSearch={mockToggleSearch}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    const signInButton = screen.getByTestId("button");
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/auth/sign-in");

    expect(screen.queryByTestId("bag-icon")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("desktop-profile-menu"),
    ).not.toBeInTheDocument();
  });

  it("when authenticated & desktop: shows bag with badge after mount and DesktopProfileMenu; does not show menu icon", async () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });

    const session = { user: { id: "user-1" } } as any;

    render(
      <NoSearchingStateHeader
        session={session}
        toggleSearch={mockToggleSearch}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    expect(screen.getByTestId("bag-icon")).toBeInTheDocument();

    expect(screen.getByTestId("desktop-profile-menu")).toBeInTheDocument();

    expect(screen.queryByTestId("icon-button")).not.toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("badge")).toHaveAttribute("data-badge", "5"),
    );
  });

  it("when authenticated & not desktop: shows bag with badge after mount and menu icon; does not show DesktopProfileMenu", async () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });

    const session = { user: { id: "user-2" } } as any;

    render(
      <NoSearchingStateHeader
        session={session}
        toggleSearch={mockToggleSearch}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    expect(screen.getByTestId("bag-icon")).toBeInTheDocument();

    const menuButton = screen.getByTestId("icon-button");
    expect(menuButton).toBeInTheDocument();

    expect(
      screen.queryByTestId("desktop-profile-menu"),
    ).not.toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(mockHandleToggleDrawer).toHaveBeenCalled();

    await waitFor(() =>
      expect(screen.getByTestId("badge")).toHaveAttribute("data-badge", "5"),
    );
  });

  it("clicking the search container calls toggleSearch", () => {
    (useMediaBreakpoints as jest.Mock).mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });

    render(
      <NoSearchingStateHeader
        session={null}
        toggleSearch={mockToggleSearch}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    const searchElement = screen.getByTestId("searchbar-medium");
    fireEvent.click(searchElement.parentElement!);

    expect(mockToggleSearch).toHaveBeenCalled();
  });
});
