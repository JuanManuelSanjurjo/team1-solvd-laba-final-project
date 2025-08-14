import React from "react";
import { render, screen } from "@testing-library/react";
import { EditProductModalWrapper } from "@/app/(side-bar)/my-products/components/EditProductModalWrapper";

describe("EditProductModalWrapper", () => {
  it("renders children when open is true", () => {
    render(
      <EditProductModalWrapper open={true} onClose={jest.fn()}>
        <div data-testid="child">Child content</div>
      </EditProductModalWrapper>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("does not render children when open is false", () => {
    render(
      <EditProductModalWrapper open={false} onClose={jest.fn()}>
        <div data-testid="child">Child content</div>
      </EditProductModalWrapper>
    );

    const el = screen.queryByTestId("child");
    expect(el).toBeNull();
  });
});
