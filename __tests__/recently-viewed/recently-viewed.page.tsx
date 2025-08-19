import { render, screen } from "@testing-library/react";
import RecentlyViewed from "@/app/(side-bar)/(profile)/recently-viewed/page";
import "@testing-library/jest-dom";
import { setupMockRecentlyViewedStore } from "__tests__/mocks/recently-viewed/mock-recentlyviewed-data";
import {
  mockCardProduct,
  mockCardProduct2,
} from "__tests__/mocks/shared/mock-product-card";

jest.mock("zustand/middleware", () => ({
  ...jest.requireActual("zustand/middleware"),
  persist: <T,>(config: T) => config,
}));

jest.mock("@/store/recentlyviewed", () => ({
  useRecentlyViewedStore: jest.fn(),
}));

describe("RecentlyViewedPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display recently viewed products when the list is not empty", () => {
    setupMockRecentlyViewedStore([mockCardProduct, mockCardProduct2]);

    render(<RecentlyViewed />);

    expect(
      screen.getByRole("heading", { name: /Recently viewed/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Mock snicker")).toBeInTheDocument();
    expect(screen.getByText("Mock snicker 2")).toBeInTheDocument();
  });

  it("should display a message when the list is empty", () => {
    setupMockRecentlyViewedStore([]);

    render(<RecentlyViewed />);

    expect(
      screen.getByText(/No recently viewed products/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("Mock snicker")).not.toBeInTheDocument();
  });
});
