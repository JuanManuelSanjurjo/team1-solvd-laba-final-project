import React from "react";
import { render, screen } from "@testing-library/react";

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("MyWishlist page", () => {
  it("redirects to /auth/sign-in when session is null", async () => {
    jest.doMock("@/auth", () => ({
      auth: jest.fn().mockResolvedValue(null),
    }));

    const redirectMock = jest.fn((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    });

    jest.doMock("next/navigation", () => ({
      redirect: redirectMock,
    }));

    jest.doMock(
      "@/app/(side-bar)/(profile)/my-wishlist/components/Wishlist",
      () => ({
        __esModule: true,
        default: () => <div data-testid="wishlist">SHOULD NOT RENDER</div>,
      })
    );

    const { default: MyWishlist } = await import(
      "@/app/(side-bar)/(profile)/my-wishlist/page"
    );

    await expect(MyWishlist()).rejects.toThrow("REDIRECT:/auth/sign-in");
    expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("renders Wishlist with the resolved session", async () => {
    const fakeSession = {
      user: { name: "Juan", avatar: { url: "https://example.com/avatar.png" } },
    };

    jest.doMock("@/auth", () => ({
      auth: jest.fn().mockResolvedValue(fakeSession),
    }));

    const redirectMock = jest.fn();
    jest.doMock("next/navigation", () => ({
      redirect: redirectMock,
    }));

    const wishlistSpy = jest.fn(({ session }: { session: any }) => (
      <div data-testid="wishlist">Welcome {session?.user?.name}</div>
    ));

    jest.doMock(
      "@/app/(side-bar)/(profile)/my-wishlist/components/Wishlist",
      () => ({
        __esModule: true,
        default: wishlistSpy,
      })
    );

    const { default: MyWishlist } = await import(
      "@/app/(side-bar)/(profile)/my-wishlist/page"
    );
    const ui = await MyWishlist();
    render(ui);

    expect(redirectMock).not.toHaveBeenCalled();

    expect(wishlistSpy).toHaveBeenCalledTimes(1);
    const [props] = (wishlistSpy as jest.Mock).mock.calls[0];
    expect(props).toEqual({ session: fakeSession });

    expect(screen.getByTestId("wishlist")).toHaveTextContent("Welcome Juan");
  });
});
