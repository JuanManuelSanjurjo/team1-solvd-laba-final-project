import React from "react";
import { render, screen } from "@testing-library/react";

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("RecentlyViewedPage", () => {
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
      "@/app/(side-bar)/(profile)/recently-viewed/components/RecentlyViewed",
      () => ({
        __esModule: true,
        default: () => (
          <div data-testid="recently-viewed">SHOULD NOT RENDER</div>
        ),
      })
    );

    const { default: RecentlyViewedPage } = await import(
      "@/app/(side-bar)/(profile)/recently-viewed/page"
    );

    await expect(RecentlyViewedPage()).rejects.toThrow(
      "REDIRECT:/auth/sign-in"
    );
    expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("renders RecentlyViewed with the resolved session", async () => {
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

    const recentlyViewedSpy = jest.fn(({ session }: { session: any }) => (
      <div data-testid="recently-viewed">Hello {session?.user?.name}</div>
    ));
    jest.doMock(
      "@/app/(side-bar)/(profile)/recently-viewed/components/RecentlyViewed",
      () => ({
        __esModule: true,
        default: recentlyViewedSpy,
      })
    );

    const { default: RecentlyViewedPage } = await import(
      "@/app/(side-bar)/(profile)/recently-viewed/page"
    );
    const ui = await RecentlyViewedPage();
    render(ui);

    expect(redirectMock).not.toHaveBeenCalled();

    expect(recentlyViewedSpy).toHaveBeenCalledTimes(1);
    const [props] = (recentlyViewedSpy as jest.Mock).mock.calls[0];
    expect(props).toEqual({ session: fakeSession });

    expect(screen.getByTestId("recently-viewed")).toHaveTextContent(
      "Hello Juan"
    );
  });
});
