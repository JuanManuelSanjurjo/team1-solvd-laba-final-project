/**
 * __tests__/my-products/components/EditProductModalWrapper.test.tsx
 */

import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { EditProductModalWrapper } from "@/app/(side-bar)/my-products/components/EditProductModalWrapper";

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("EditProductModalWrapper", () => {
  test("renders children when open=true and hides them when open=false", async () => {
    const Child = () => <div data-testid="modal-child">Hello modal</div>;

    const { rerender } = render(
      <EditProductModalWrapper open={true} onClose={() => {}}>
        <Child />
      </EditProductModalWrapper>
    );

    expect(screen.getByTestId("modal-child")).toBeInTheDocument();

    // Close the modal
    rerender(
      <EditProductModalWrapper open={false} onClose={() => {}}>
        <Child />
      </EditProductModalWrapper>
    );

    // Modal may remove children asynchronously; wait for it
    await waitFor(() => {
      expect(screen.queryByTestId("modal-child")).toBeNull();
    });
  });
});
