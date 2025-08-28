/**
 * __tests__/my-products/components/EditProductHeader.test.tsx
 */

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { EditProductHeader } from "@/app/(side-bar)/my-products/components/EditProductHeader";

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("EditProductHeader", () => {
  test("displays title and triggers onClose when close icon clicked", () => {
    const onClose = jest.fn();
    const titleText = "Edit product title";

    const { container } = render(
      <EditProductHeader onClose={onClose} title={titleText} />
    );

    // Title should render
    expect(screen.getByText(titleText)).toBeInTheDocument();

    // CloseIcon renders an SVG — find it and click
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();

    fireEvent.click(svg!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
