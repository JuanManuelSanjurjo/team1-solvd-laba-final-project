import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SizeSelectorModal from "@/app/(purchase)/components/SizeSelectorModal";

//Mocks
jest.mock("@/components/Button", () => {
  return function MockButton({ children, onClick, disabled }: any) {
    return (
      <button
        data-testid={`button-${children}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
});

describe("SizeSelectorModal", () => {
  const defaultProps = {
    showModal: true,
    onClose: jest.fn(),
    onPrimary: jest.fn(),
    title: "Select Size",
    text: "Please choose your shoe size",
    secondaryBtn: "Cancel",
    primaryBtn: "Confirm",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when showModal is true", () => {
    render(<SizeSelectorModal {...defaultProps} />);
    expect(screen.getByText("Select Size")).toBeInTheDocument();
    expect(
      screen.getByText("Please choose your shoe size")
    ).toBeInTheDocument();
  });

  it("does not render when showModal is false", () => {
    render(<SizeSelectorModal {...defaultProps} showModal={false} />);
    expect(screen.queryByText("Select Size")).not.toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <SizeSelectorModal {...defaultProps}>
        <div data-testid="child">Extra Content</div>
      </SizeSelectorModal>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<SizeSelectorModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("button-Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onPrimary when Confirm button is clicked", () => {
    render(<SizeSelectorModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("button-Confirm"));
    expect(defaultProps.onPrimary).toHaveBeenCalled();
  });

  it("calls onClose when close icon is clicked", () => {
    render(<SizeSelectorModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("close"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("renders custom button labels", () => {
    render(
      <SizeSelectorModal
        {...defaultProps}
        secondaryBtn="Go Back"
        primaryBtn="Save"
      />
    );
    expect(screen.getByTestId("button-Go Back")).toBeInTheDocument();
    expect(screen.getByTestId("button-Save")).toBeInTheDocument();
  });
});
