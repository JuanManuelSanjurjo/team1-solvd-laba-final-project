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

    rerender(
      <EditProductModalWrapper open={false} onClose={() => {}}>
        <Child />
      </EditProductModalWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("modal-child")).toBeNull();
    });
  });
});
