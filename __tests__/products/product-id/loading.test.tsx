import { render, screen } from "@testing-library/react";
import Loading from "@/app/products/loading";

jest.mock("@/components/skeletons/products/SkeletonCardContainer", () => () => (
  <div data-testid="skeleton-card-container" />
));

jest.mock("@/components/skeletons/SidebarSkeleton", () => () => (
  <div data-testid="sidebar-skeleton" />
));

describe("Loading component", () => {
  it("renders Loading component with skeletons", () => {
    render(<Loading />);

    expect(screen.getByTestId("sidebar-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-card-container")).toBeInTheDocument();
  });
});
