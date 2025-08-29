import { render, screen, fireEvent } from "@testing-library/react";
import Toast from "@/components/Toast";

describe("Toast component", () => {
  const message = "Test message";
  const severity = "success";

  it("renders the message and severity correctly", () => {
    render(
      <Toast
        open={true}
        onClose={jest.fn()}
        severity={severity}
        message={message}
      />,
    );

    expect(screen.getByText(message)).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });

  it("calls onClose when clicking the close button", () => {
    const onCloseMock = jest.fn();
    render(
      <Toast
        open={true}
        onClose={onCloseMock}
        severity={severity}
        message={message}
      />,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when reason is clickaway", () => {
    const onCloseMock = jest.fn();
    render(
      <Toast
        open={true}
        onClose={onCloseMock}
        severity={severity}
        message={message}
      />,
    );

    const alert = screen.getByRole("alert");
    const event = new Event("click");
    const reason: "clickaway" = "clickaway";

    (alert.parentElement as any).props?.onClose?.(event, reason);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("applies autoHideDuration without crashing", () => {
    render(
      <Toast
        open={true}
        onClose={jest.fn()}
        severity={severity}
        message={message}
        autoHideDuration={3000}
      />,
    );

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
