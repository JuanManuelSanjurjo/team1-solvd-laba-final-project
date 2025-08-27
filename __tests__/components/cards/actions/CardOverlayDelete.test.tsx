import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardOverlayDelete from "@/components/cards/actions/CardOverlayDelete";

describe("CardOverlayDelete", () => {
  let mockOnDeletePreview: jest.Mock;

  beforeEach(() => {
    mockOnDeletePreview = jest.fn();
    jest.clearAllMocks();
  });

  it("renders the overlay container", () => {
    const { container } = render(
      <CardOverlayDelete onDeletePreview={mockOnDeletePreview} />,
    );

    const overlay = container.querySelector(".overlay");
    expect(overlay).toBeInTheDocument();
  });

  it("calls onDeletePreview when clicking the trash icon (.bg)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CardOverlayDelete onDeletePreview={mockOnDeletePreview} />,
    );

    const icon = container.querySelector(".bg");
    expect(icon).toBeTruthy();

    await user.click(icon as Element);
    expect(mockOnDeletePreview).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onDeletePreview when clicking the overlay (outside the icon)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CardOverlayDelete onDeletePreview={mockOnDeletePreview} />,
    );

    const overlay = container.querySelector(".overlay");
    const icon = container.querySelector(".bg");
    expect(overlay).toBeTruthy();
    expect(icon).toBeTruthy();

    await user.click(overlay as Element);
    expect(mockOnDeletePreview).not.toHaveBeenCalled();

    await user.click(icon as Element);
    expect(mockOnDeletePreview).toHaveBeenCalledTimes(1);
  });

  it("calls onDeletePreview for each click (multiple clicks)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CardOverlayDelete onDeletePreview={mockOnDeletePreview} />,
    );

    const icon = container.querySelector(".bg");
    expect(icon).toBeTruthy();

    await user.click(icon as Element);
    await user.click(icon as Element);
    await user.click(icon as Element);

    expect(mockOnDeletePreview).toHaveBeenCalledTimes(3);
  });
});
