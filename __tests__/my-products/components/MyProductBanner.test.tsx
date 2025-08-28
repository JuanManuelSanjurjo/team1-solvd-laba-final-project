/**
 * __tests__/my-products/components/MyProductsBanner.test.tsx
 */

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Mock BannerProfileCard (child) before importing the banner
jest.mock("@/app/(side-bar)/my-products/components/BannerProfileCard", () => ({
  __esModule: true,
  default: () => <div data-testid="banner-profile-card" />,
}));

import MyProductsBanner from "@/app/(side-bar)/my-products/components/MyProductsBanner";

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("MyProductsBanner", () => {
  test("renders banner image and BannerProfileCard", () => {
    render(<MyProductsBanner />);

    // The component renders an img via MUI Box component (component="img")
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/assets/images/profile-banner.png");

    // BannerProfileCard is mocked and should be present
    expect(screen.getByTestId("banner-profile-card")).toBeInTheDocument();
  });
});
