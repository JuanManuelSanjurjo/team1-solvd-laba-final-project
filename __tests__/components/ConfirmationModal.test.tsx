import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationModal from "@/components/ConfirmationModal";

jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: ({
    onClick,
    children,
    variant,
    size,
    fullWidth,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    variant: string;
    size: string;
    fullWidth: boolean;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      data-fullwidth={fullWidth ? "true" : "false"}
    >
      {children}
    </button>
  ),
}));

jest.mock("iconsax-react", () => ({
  Add: ({
    color,
    size,
    style,
  }: {
    color: string;
    size: number;
    style: object;
  }) => <div data-color={color} data-size={size} style={style} />,
}));

describe("ConfirmationModal Component", () => {
  const defaultProps = {
    showModal: true,
    onClose: jest.fn(),
    onPrimary: jest.fn(),
    title: "Test Title",
    text: "Test Text",
    secondaryBtn: "Cancel",
    primaryBtn: "Delete",
  };

  it("does not render the dialog when showModal is false", () => {
    render(<ConfirmationModal {...defaultProps} showModal={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog when showModal is true", () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays the provided title and text", () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });

  it("uses default title and text when not provided", () => {
    render(<ConfirmationModal {...defaultProps} title="" text="" />);
    expect(
      screen.getByText("Are you sure to delete product image"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur.",
      ),
    ).toBeInTheDocument();
  });

  it("displays the provided button texts", () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: defaultProps.secondaryBtn }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: defaultProps.primaryBtn }),
    ).toBeInTheDocument();
  });

  it("uses default button texts when not provided", () => {
    render(
      <ConfirmationModal {...defaultProps} secondaryBtn="" primaryBtn="" />,
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onClose when secondary button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    const secondaryButton = screen.getByRole("button", {
      name: defaultProps.secondaryBtn,
    });
    await user.click(secondaryButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onPrimary when primary button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    const primaryButton = screen.getByRole("button", {
      name: defaultProps.primaryBtn,
    });
    await user.click(primaryButton);
    expect(defaultProps.onPrimary).toHaveBeenCalled();
  });

  it("calls onClose when close icon button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    const closeButton = screen.getByLabelText("close");
    await user.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("has the correct aria attributes", () => {
    render(<ConfirmationModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      "customized-dialog-title",
    );
  });
});
