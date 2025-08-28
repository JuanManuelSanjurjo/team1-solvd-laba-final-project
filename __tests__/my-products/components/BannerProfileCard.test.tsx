import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

jest.mock("@/components/ProfilePicture", () => ({
  ProfilePicture: (props: any) => (
    <img data-testid="profile-picture" src={props.src} alt={props.alt} />
  ),
}));

const mockAuth = jest.fn();
jest.mock("@/auth", () => ({
  auth: (...args: any[]) => mockAuth(...args),
}));

import BannerProfileCard from "@/app/(side-bar)/my-products/components/BannerProfileCard";

describe("BannerProfileCard (async)", () => {
  test("renders session avatar and username when auth returns session", async () => {
    mockAuth.mockResolvedValueOnce({
      user: {
        avatar: { url: "https://cdn.example/avatar1.jpg" },
        username: "alice",
      },
    });

    const element = await BannerProfileCard();
    render(element);

    const img = screen.getByTestId("profile-picture") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://cdn.example/avatar1.jpg");

    expect(screen.getByText("alice")).toBeInTheDocument();
  });

  test("falls back to default profilePic when auth returns null", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const element = await BannerProfileCard();
    render(element);

    const img = screen.getByTestId("profile-picture") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("");
  });
});
