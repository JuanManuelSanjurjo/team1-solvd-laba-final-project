import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideBarIcon from "@/components/SideBarIcon";

const TestIcon: React.FC<any> = (props) => (
  <svg
    data-testid="test-icon"
    data-size={String(props.size)}
    data-color={props.color}
  />
);

describe("SideBarIcon", () => {
  it("renders the provided Icon", () => {
    render(<SideBarIcon Icon={TestIcon} active={false} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it('passes size "20" to the Icon', () => {
    render(<SideBarIcon Icon={TestIcon} active={false} />);
    const svg = screen.getByTestId("test-icon");
    expect(svg).toHaveAttribute("data-size", "20");
  });

  it("uses active color (#FE645E) when active=true", () => {
    render(<SideBarIcon Icon={TestIcon} active={true} />);
    const svg = screen.getByTestId("test-icon");
    expect(svg).toHaveAttribute("data-color", "#FE645E");
  });

  it("uses inactive color (#6E7378) when active=false", () => {
    render(<SideBarIcon Icon={TestIcon} active={false} />);
    const svg = screen.getByTestId("test-icon");
    expect(svg).toHaveAttribute("data-color", "#6E7378");
  });
});
