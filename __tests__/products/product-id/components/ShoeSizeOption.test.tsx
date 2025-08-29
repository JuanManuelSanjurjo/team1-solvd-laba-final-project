import { render, screen, fireEvent } from "@testing-library/react";
import ShoeSizeOption from "@/app/products/[product-id]/components/ShoeSizeOption";

describe("ShoeSizeOption", () => {
  const defaultProps = {
    size: 40,
    disabled: false,
    value: 40,
    checked: false,
    onToggle: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    render(<ShoeSizeOption {...defaultProps} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(boxElement).toBeInTheDocument();
    expect(boxElement).toHaveTextContent("EU-40");
    expect(boxElement).toHaveStyle("color: #5c5c5c");
    expect(boxElement).toHaveStyle("backgroundColor: #ffffff");
  });

  it("renders with checked state when checked prop is true", () => {
    render(<ShoeSizeOption {...defaultProps} checked={true} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(boxElement).toHaveStyle("color: #FE645E");
    expect(boxElement).toHaveStyle("border: 1px solid #FE645E");
  });

  it("renders with disabled state when disabled prop is true", () => {
    render(<ShoeSizeOption {...defaultProps} disabled={true} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(boxElement).toHaveStyle("color: #C3C3C3");
    expect(boxElement).toHaveStyle("backgroundColor: #F0F0F0");
    expect(boxElement).toHaveStyle("cursor: not-allowed");
  });

  it("calls onToggle when clicked and not disabled", () => {
    const onToggleMock = jest.fn();
    render(<ShoeSizeOption {...defaultProps} onToggle={onToggleMock} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    fireEvent.click(boxElement);

    expect(onToggleMock).toHaveBeenCalledWith(40);
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onToggle when clicked and disabled", () => {
    const onToggleMock = jest.fn();
    render(
      <ShoeSizeOption
        {...defaultProps}
        disabled={true}
        onToggle={onToggleMock}
      />
    );

    const boxElement = screen.getByTestId("shoe-size-option");
    fireEvent.click(boxElement);

    expect(onToggleMock).not.toHaveBeenCalled();
  });

  it("uses default value of 0 when value prop is not provided", () => {
    const onToggleMock = jest.fn();
    render(
      <ShoeSizeOption size={40} disabled={false} onToggle={onToggleMock} />
    );

    const boxElement = screen.getByTestId("shoe-size-option");
    fireEvent.click(boxElement);

    expect(onToggleMock).toHaveBeenCalledWith(0);
  });

  it("uses default onToggle function when not provided", () => {
    // This test ensures the default function doesn't throw errors
    render(<ShoeSizeOption size={40} disabled={false} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(() => {
      fireEvent.click(boxElement);
    }).not.toThrow();
  });

  it("applies correct transition styles", () => {
    render(<ShoeSizeOption {...defaultProps} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(boxElement).toHaveStyle("transition: all 0.2s ease-in");
  });

  it("applies base styles correctly", () => {
    render(<ShoeSizeOption {...defaultProps} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(boxElement).toHaveStyle("borderRadius: 8px");
    expect(boxElement).toHaveStyle("padding: 15px");
    expect(boxElement).toHaveStyle("textAlign: center");
    expect(boxElement).toHaveStyle("border: 1px solid #494949");
  });

  it("handles different size values correctly", () => {
    render(<ShoeSizeOption {...defaultProps} size={42} />);

    const boxElement = screen.getByTestId("shoe-size-option");
    expect(boxElement).toHaveTextContent("EU-42");
  });

  it("handles different value prop correctly", () => {
    const onToggleMock = jest.fn();
    render(
      <ShoeSizeOption {...defaultProps} value={99} onToggle={onToggleMock} />
    );

    const boxElement = screen.getByTestId("shoe-size-option");
    fireEvent.click(boxElement);

    expect(onToggleMock).toHaveBeenCalledWith(99);
  });
});
