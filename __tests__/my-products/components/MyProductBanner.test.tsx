import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

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

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/assets/images/profile-banner.png");

    expect(screen.getByTestId("banner-profile-card")).toBeInTheDocument();
  });
});
