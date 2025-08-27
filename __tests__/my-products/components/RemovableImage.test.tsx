import { render, screen, fireEvent } from "@testing-library/react";
import RemovableImage from "@/app/(side-bar)/my-products/add-product/components/RemovableImage";
import { product } from "@/mocks/product";

const onDeletePreview = jest.fn();
const productWithImage = { ...product, image: "http://example.com/image.jpg" };

jest.mock("@/components/cards/actions/CardOverlayDelete", () => ({
  __esModule: true,
  default: jest.fn(({ onDeletePreview }) => (
    <button onClick={onDeletePreview}>Delete</button>
  )),
}));

jest.mock("@/components/cards/wrappers/CardActionWrapperCenter", () => ({
  __esModule: true,
  default: jest.fn(({ action }) => (
    <div>
      Wrapper
      {action}
    </div>
  )),
}));

describe("RemovableImage", () => {
  it("renders the image", () => {
    render(
      <RemovableImage
        product={productWithImage}
        image={undefined}
        overlayAction="onDeletePreview"
        onDeletePreview={onDeletePreview}
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "http://example.com/image.jpg");
  });

  it("renders the image from image prop when product has no image", () => {
    render(<RemovableImage image="http://placeholder-image.jpg" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "http://placeholder-image.jpg");
  });

  it("renders the image from image prop when product is provided but has no image", () => {
    render(
      <RemovableImage
        product={{ ...product, image: undefined }}
        image="http://placeholder-image.jpg"
      />,
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "http://placeholder-image.jpg");
  });

  it("renders No image available when the image is not provided", () => {
    render(
      <RemovableImage
        product={{ ...productWithImage, image: undefined }}
        image={undefined}
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "No image available");
  });

  it("renders the cardWrapper when an action is provided", () => {
    render(
      <RemovableImage product={productWithImage} overlayAction="Delete" />,
    );

    expect(screen.getByText("Wrapper")).toBeInTheDocument();
  });

  it("renders the delete button when an action is provided", () => {
    render(
      <RemovableImage product={productWithImage} overlayAction="Delete" />,
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("passes onDeletePreview to the delete button", () => {
    const onDeletePreview = jest.fn();
    render(
      <RemovableImage
        product={productWithImage}
        overlayAction="Delete"
        onDeletePreview={onDeletePreview}
      />,
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(onDeletePreview).toHaveBeenCalled();
  });

  it("uses default onDeletePreview when not provided", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(
      <RemovableImage product={productWithImage} overlayAction="Delete" />,
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("does not render the cardWrapper when no action is provided", () => {
    render(<RemovableImage product={productWithImage} />);

    expect(screen.queryByText("Wrapper")).not.toBeInTheDocument();
  });
});
