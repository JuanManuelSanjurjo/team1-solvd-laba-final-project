/**
 * __tests__/my-products/components/BannerProfileCard.test.tsx
 */

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

// Mock ProfilePicture before importing the component
jest.mock("@/components/ProfilePicture", () => ({
  ProfilePicture: (props: any) => (
    <img data-testid="profile-picture" src={props.src} alt={props.alt} />
  ),
}));

// Create a mock for auth that we can control in tests
const mockAuth = jest.fn();
jest.mock("@/auth", () => ({
  auth: (...args: any[]) => mockAuth(...args),
}));

// Import the async component after mocks
import BannerProfileCard from "@/app/(side-bar)/my-products/components/BannerProfileCard";

describe("BannerProfileCard (async)", () => {
  test("renders session avatar and username when auth returns session", async () => {
    mockAuth.mockResolvedValueOnce({
      user: {
        avatar: { url: "https://cdn.example/avatar1.jpg" },
        username: "alice",
      },
    });

    // BannerProfileCard is an async server component exported as default
    const element = await BannerProfileCard();
    render(element);

    const img = screen.getByTestId("profile-picture") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://cdn.example/avatar1.jpg");

    // username should be rendered as text
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
