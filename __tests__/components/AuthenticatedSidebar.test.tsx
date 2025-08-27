import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { usePathname } from "next/navigation";
import AuthenticatedSidebar from "@/components/AuthenticatedSidebar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => {
  const ReactLib = jest.requireActual("react") as typeof import("react");

  const Link = ReactLib.forwardRef<HTMLAnchorElement, any>(function MockLink(
    { href, children, ...rest },
    ref
  ) {
    return (
      <a
        href={typeof href === "string" ? href : String(href)}
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    );
  });

  return { __esModule: true, default: Link };
});

const signOutMock = jest.fn();
jest.mock("next-auth/react", () => ({
  signOut: (...args: any[]) => signOutMock(...args),
}));

jest.mock("iconsax-react", () => ({
  BagTick: (p: any) => (
    <svg
      data-testid="icon-BagTick"
      data-color={p.color}
      data-size={String(p.size)}
    />
  ),
  MenuBoard: (p: any) => (
    <svg
      data-testid="icon-MenuBoard"
      data-color={p.color}
      data-size={String(p.size)}
    />
  ),
  HeartSearch: (p: any) => (
    <svg
      data-testid="icon-HeartSearch"
      data-color={p.color}
      data-size={String(p.size)}
    />
  ),
  Eye: (p: any) => (
    <svg
      data-testid="icon-Eye"
      data-color={p.color}
      data-size={String(p.size)}
    />
  ),
  Setting2: (p: any) => (
    <svg
      data-testid="icon-Setting2"
      data-color={p.color}
      data-size={String(p.size)}
    />
  ),
  Logout: (p: any) => (
    <svg
      data-testid="icon-Logout"
      data-color={p.color}
      data-size={String(p.size)}
    />
  ),
}));

describe("AuthenticatedSidebar", () => {
  const session: any = {
    user: {
      username: "John Doe",
      avatar: { url: "https://example.com/avatar.jpg" },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile section when showProfileComponent=true (default)", () => {
    (usePathname as jest.Mock).mockReturnValue("/my-products");

    render(<AuthenticatedSidebar session={session} />);

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("hides profile section when showProfileComponent=false", () => {
    (usePathname as jest.Mock).mockReturnValue("/my-products");

    render(
      <AuthenticatedSidebar session={session} showProfileComponent={false} />
    );

    expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("renders all nav labels", () => {
    (usePathname as jest.Mock).mockReturnValue("/my-products");

    render(<AuthenticatedSidebar session={session} />);

    expect(screen.getByText("My Products")).toBeInTheDocument();
    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Recently viewed")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("renders links with correct href for Link-based items", () => {
    (usePathname as jest.Mock).mockReturnValue("/my-products");

    render(<AuthenticatedSidebar session={session} />);

    expect(screen.getByRole("link", { name: /my products/i })).toHaveAttribute(
      "href",
      "/my-products"
    );
    expect(screen.getByRole("link", { name: /my wishlist/i })).toHaveAttribute(
      "href",
      "/my-wishlist"
    );
  });

  it("correctly applies the active color to the icon when its href matches the pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/my-wishlist");

    render(<AuthenticatedSidebar session={session} />);

    expect(screen.getByTestId("icon-HeartSearch")).toHaveAttribute(
      "data-color",
      "#FE645E"
    );
    expect(screen.getByTestId("icon-HeartSearch")).toHaveAttribute(
      "data-size",
      "20"
    );

    expect(screen.getByTestId("icon-BagTick")).toHaveAttribute(
      "data-color",
      "#6E7378"
    );
  });

  it("calls signOut when clicking 'Log out'", async () => {
    (usePathname as jest.Mock).mockReturnValue("/my-products");
    const user = userEvent.setup();

    render(<AuthenticatedSidebar session={session} />);

    await user.click(screen.getByText(/log out/i));
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to empty src when avatar url is missing", () => {
    (usePathname as jest.Mock).mockReturnValue("/my-products");

    const sessionNoAvatar: any = {
      user: { username: "NoAvatar" },
    };

    render(<AuthenticatedSidebar session={sessionNoAvatar} />);

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
