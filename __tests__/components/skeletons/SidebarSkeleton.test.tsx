import { render, screen } from "@testing-library/react";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";

describe("SidebarSkeleton Component", () => {
  it("should render the component", () => {
    render(<SidebarSkeleton />);

    const sidebarSkeleton = screen.getByTestId("sidebar-skeleton");
    expect(sidebarSkeleton).toBeInTheDocument();
  });
});
