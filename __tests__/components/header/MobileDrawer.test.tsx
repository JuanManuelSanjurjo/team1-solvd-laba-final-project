import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileDrawer from "@/components/header/MobileDrawer";

jest.mock("@mui/material/Box", () => {
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  };
});
jest.mock("@mui/material/Drawer", () => {
  return {
    __esModule: true,
    default: ({ children, open, ...props }: any) => (
      <div data-testid="drawer" data-open={String(open)} {...props}>
        {children}
      </div>
    ),
  };
});
jest.mock("@mui/material/Backdrop", () => {
  return {
    __esModule: true,
    default: ({ children, open, onClick, ...props }: any) => (
      <div
        data-testid="backdrop"
        data-open={String(open)}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    ),
  };
});
jest.mock("@mui/material/IconButton", () => {
  return {
    __esModule: true,
    default: ({ children, onClick, ...props }: any) => (
      <button data-testid="icon-button" onClick={onClick} {...props}>
        {children}
      </button>
    ),
  };
});

jest.mock("iconsax-react", () => ({
  __esModule: true,
  Add: (props: any) => <svg data-testid="add-icon" {...props} />,
}));

jest.mock("@/components/AuthenticatedSidebar", () => ({
  __esModule: true,
  default: ({ session, showProfileComponent, width }: any) => (
    <div
      data-testid="auth-sidebar"
      data-show={String(showProfileComponent)}
      data-width={String(width)}
    >
      {session?.user?.id ?? "no-session"}
    </div>
  ),
}));

describe("MobileDrawer", () => {
  const mockHandleToggleDrawer = jest.fn();
  const sessionMock = { user: { id: "user-123" } } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Drawer open state when `open` is true and shows AuthenticatedSidebar", () => {
    render(
      <MobileDrawer
        session={sessionMock}
        open={true}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    const drawer = screen.getByTestId("drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("data-open", "true");

    const sidebar = screen.getByTestId("auth-sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveTextContent("user-123");
    expect(sidebar).toHaveAttribute("data-show", "false");
    expect(sidebar).toHaveAttribute("data-width", "240");
  });

  it("renders Drawer closed state when `open` is false", () => {
    render(
      <MobileDrawer
        session={sessionMock}
        open={false}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    const drawer = screen.getByTestId("drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("data-open", "false");
  });

  it("clicking the backdrop calls handleToggleDrawer", () => {
    render(
      <MobileDrawer
        session={sessionMock}
        open={true}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    const backdrop = screen.getByTestId("backdrop");
    fireEvent.click(backdrop);
    expect(mockHandleToggleDrawer).toHaveBeenCalled();
  });

  it("clicking the close icon button calls handleToggleDrawer", () => {
    render(
      <MobileDrawer
        session={sessionMock}
        open={true}
        handleToggleDrawer={mockHandleToggleDrawer}
      />,
    );

    const iconButton = screen.getByTestId("icon-button");
    expect(iconButton).toBeInTheDocument();

    expect(screen.getByTestId("add-icon")).toBeInTheDocument();

    fireEvent.click(iconButton);
    expect(mockHandleToggleDrawer).toHaveBeenCalled();
  });
});
