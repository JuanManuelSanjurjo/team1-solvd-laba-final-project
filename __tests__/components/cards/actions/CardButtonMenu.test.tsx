import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardButtonMenu from "@/components/cards/actions/CardButtonMenu";
import { product } from "@/mocks/product";

const mockProduct = { ...product, image: "http://example.com/image.jpg" };

jest.mock("@/components/ConfirmationModal", () => ({
  __esModule: true,
  default: ({
    showModal,
    onClose,
    title,
    text,
    primaryBtn,
    secondaryBtn,
    onPrimary,
  }: {
    showModal: boolean;
    onClose: (e: React.SyntheticEvent) => void;
    title: string;
    text: string;
    primaryBtn: string;
    secondaryBtn: string;
    onPrimary: (e: React.SyntheticEvent) => void;
  }) => {
    if (!showModal) return null;
    return (
      <div role="dialog">
        <h2>{title}</h2>
        <p>{text}</p>
        <button
          onClick={(e) => {
            e.preventDefault();
            onPrimary(e);
          }}
        >
          {primaryBtn}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onClose(e);
          }}
        >
          {secondaryBtn}
        </button>
      </div>
    );
  },
}));

const mockOnEdit = jest.fn();
const mockOnDuplicate = jest.fn();
const mockOnDelete = jest.fn();

describe("CardButtonMenu Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the icon button initially", () => {
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    expect(iconButton).toBeInTheDocument();
  });

  it("opens the menu when icon button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: "View" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Edit" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Duplicate" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Delete" }),
      ).toBeInTheDocument();
    });
  });

  it("closes the menu when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: "View" }),
      ).toBeInTheDocument();
    });

    // Find and click the backdrop to simulate outside click
    const backdrop = document.querySelector(".MuiBackdrop-root");
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    await waitFor(() => {
      expect(
        screen.queryByRole("menuitem", { name: "View" }),
      ).not.toBeInTheDocument();
    });
  });

  it("navigates to view link when View menu item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    const viewItem = await screen.findByRole("menuitem", { name: "View" });
    expect(viewItem).toHaveAttribute("href", `/products/${mockProduct.id}`);
  });

  it("calls onEdit and closes menu when Edit menu item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    const editItem = await screen.findByRole("menuitem", { name: "Edit" });
    await user.click(editItem);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(
        screen.queryByRole("menuitem", { name: "Edit" }),
      ).not.toBeInTheDocument();
    });
  });

  it("calls onDuplicate and closes menu when Duplicate menu item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    const duplicateItem = await screen.findByRole("menuitem", {
      name: "Duplicate",
    });
    await user.click(duplicateItem);

    expect(mockOnDuplicate).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(
        screen.queryByRole("menuitem", { name: "Duplicate" }),
      ).not.toBeInTheDocument();
    });
  });

  it("opens confirmation modal when Delete menu item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    const deleteItem = await screen.findByRole("menuitem", { name: "Delete" });
    await user.click(deleteItem);

    await waitFor(() => {
      expect(
        screen.queryByRole("menuitem", { name: "Delete" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("Are you sure to delete selected item?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Please confirm this action before proceeding. Once deleted, this item will no longer be available.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Delete" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });
  });

  it("calls onDelete and closes modal when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    const deleteItem = await screen.findByRole("menuitem", { name: "Delete" });
    await user.click(deleteItem);

    const confirmButton = await screen.findByRole("button", { name: "Delete" });

    await user.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure to delete selected item?"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes modal without calling onDelete when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    const deleteItem = await screen.findByRole("menuitem", { name: "Delete" });
    await user.click(deleteItem);

    const cancelButton = await screen.findByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure to delete selected item?"),
      ).not.toBeInTheDocument();
    });
  });

  it("prevents default on event handlers", async () => {
    const user = userEvent.setup();
    const preventDefaultSpy = jest.spyOn(Event.prototype, "preventDefault");

    render(
      <CardButtonMenu
        product={mockProduct}
        onEdit={mockOnEdit}
        onDuplicate={mockOnDuplicate}
        onDelete={mockOnDelete}
      />,
    );

    const iconButton = screen.getByRole("button");
    await user.click(iconButton);

    // Test one menu item, e.g., Edit
    const editItem = await screen.findByRole("menuitem", { name: "Edit" });
    await user.click(editItem);

    expect(preventDefaultSpy).toHaveBeenCalled();
    preventDefaultSpy.mockRestore();
  });
});
