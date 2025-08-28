import { render, screen, fireEvent } from "@testing-library/react";
import DesktopProfileMenu from "@/components/header/DesktopProfileMenu";
import { signOut } from "next-auth/react";
import { useToastStore } from "@/store/toastStore";
import { Session } from "next-auth";

jest.mock("@/components/ProfilePicture", () => ({
  ProfilePicture: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="profile-picture" onClick={onClick}>
      Profile Picture
    </button>
  ),
}));

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

const mockShow = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: jest.fn(),
}));

describe("DesktopProfileMenu", () => {
  beforeEach(() => {
    (useToastStore as unknown as jest.Mock).mockReturnValue({ show: mockShow });
    jest.clearAllMocks();
  });

  const mockSession = {
    user: {
      username: "john_doe",
      avatar: { url: "https://example.com/avatar.png" },
    },
  };

  it("renderiza la ProfilePicture con el alt correcto", () => {
    render(<DesktopProfileMenu session={mockSession as Session} />);
    const profilePicture = screen.getByTestId("profile-picture");
    expect(profilePicture).toBeInTheDocument();
  });

  it("el menú está cerrado por defecto", () => {
    render(<DesktopProfileMenu session={mockSession as Session} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("abre el menú al hacer click en la ProfilePicture", () => {
    render(<DesktopProfileMenu session={mockSession as Session} />);
    fireEvent.click(screen.getByTestId("profile-picture"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("cierra el menú al hacer click en un item", () => {
    render(<DesktopProfileMenu session={mockSession as Session} />);
    fireEvent.click(screen.getByTestId("profile-picture"));
    const item = screen.getByText("My Products");
    fireEvent.click(item);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("cada item de menú tiene el href correcto", () => {
    render(<DesktopProfileMenu session={mockSession as Session} />);
    fireEvent.click(screen.getByTestId("profile-picture"));

    expect(screen.getByText("My Products").closest("a")).toHaveAttribute(
      "href",
      "/my-products",
    );
    expect(screen.getByText("Order History").closest("a")).toHaveAttribute(
      "href",
      "/order-history",
    );
    expect(screen.getByText("My Wishlist").closest("a")).toHaveAttribute(
      "href",
      "/my-wishlist",
    );
    expect(screen.getByText("Recently Viewed").closest("a")).toHaveAttribute(
      "href",
      "/recently-viewed",
    );
    expect(screen.getByText("Settings").closest("a")).toHaveAttribute(
      "href",
      "/update-profile",
    );
  });

  it("muestra toast y llama a signOut al hacer click en Log out", () => {
    render(<DesktopProfileMenu session={mockSession as Session} />);
    fireEvent.click(screen.getByTestId("profile-picture"));
    fireEvent.click(screen.getByText("Log out"));

    expect(mockShow).toHaveBeenCalledWith({
      severity: "success",
      message: "Logging out...",
    });
    expect(signOut).toHaveBeenCalled();
  });
});
