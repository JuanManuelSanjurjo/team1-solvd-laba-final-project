import { render, screen } from "@testing-library/react";
import React from "react";
import Loading from "@/app/products/loading";

jest.mock("@/components/skeletons/SidebarSkeleton", () => () => (
  <div data-testid="sidebar-skeleton">Mocked SidebarSkeleton</div>
));

jest.mock("@/components/skeletons/products/SkeletonCardContainer", () => () => (
  <div data-testid="skeleton-card-container">Mocked SkeletonCardContainer</div>
));

describe("Loading (Products Page)", () => {
  it("renders without crashing", () => {
    render(<Loading />);
  });

  it("renders SidebarSkeleton and SkeletonCardContainer", () => {
    render(<Loading />);
    expect(screen.getByTestId("sidebar-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-card-container")).toBeInTheDocument();
  });

  it("applies the correct Box styles", () => {
    const { container } = render(<Loading />);
    const box = container.querySelector("div");
    expect(box).toHaveStyle({
      display: "grid",
      height: "100vh",
    });
  });
});
