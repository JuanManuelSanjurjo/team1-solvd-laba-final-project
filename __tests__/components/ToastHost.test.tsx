import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ToastHost from "@/components/ToastHost";

const mockUseToastStore = jest.fn();
jest.mock("@/store/toastStore", () => ({
  __esModule: true,
  useToastStore: (...args: any[]) => mockUseToastStore(...args),
}));

jest.mock("@/components/Toast", () => ({
  __esModule: true,
  default: ({ open, onClose, severity, message }: any) => (
    <div data-testid="toast" data-open={String(open)} data-severity={severity}>
      <span data-testid="toast-message">{message}</span>
      <button data-testid="toast-close" onClick={() => onClose?.()}>
        close
      </button>
    </div>
  ),
}));

describe("ToastHost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Toast with values from the store", () => {
    const hide = jest.fn();
    mockUseToastStore.mockReturnValue({
      open: true,
      severity: "success",
      message: "Saved successfully",
      hide,
    });

    render(<ToastHost />);

    const toast = screen.getByTestId("toast");
    expect(toast).toHaveAttribute("data-open", "true");
    expect(toast).toHaveAttribute("data-severity", "success");
    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "Saved successfully"
    );
  });

  it("calls hide when Toast onClose is triggered", () => {
    const hide = jest.fn();
    mockUseToastStore.mockReturnValue({
      open: true,
      severity: "error",
      message: "Oops",
      hide,
    });

    render(<ToastHost />);
    fireEvent.click(screen.getByTestId("toast-close"));
    expect(hide).toHaveBeenCalledTimes(1);
  });

  it("renders Toast closed when open is false", () => {
    const hide = jest.fn();
    mockUseToastStore.mockReturnValue({
      open: false,
      severity: "info",
      message: "Hidden",
      hide,
    });

    render(<ToastHost />);
    expect(screen.getByTestId("toast")).toHaveAttribute("data-open", "false");
    expect(screen.getByTestId("toast-message")).toHaveTextContent("Hidden");
  });
});
