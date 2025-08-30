import { render, screen, fireEvent } from "@testing-library/react";
import CardDragAndDrop from "@/components/cards/CardDragAndDrop";

describe("CardDragAndDrop", () => {
  let onFileAdd: jest.Mock;

  beforeEach(() => {
    onFileAdd = jest.fn();
  });

  it("renders initial content", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    expect(screen.getByText(/Drop your image here or/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /click to browse/i }),
    ).toBeInTheDocument();
  });

  it("triggers input click on container click", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    const container = screen.getByText(
      /Drop your image here or/i,
    ).parentElement!;
    const input = container.querySelector("input") as HTMLInputElement;
    input.click = jest.fn();
    fireEvent.click(container);
    expect(input.click).toHaveBeenCalled();
  });

  it("calls onFileAdd on file selection", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    const container = screen.getByText(
      /Drop your image here or/i,
    ).parentElement!;
    const input = container.querySelector("input") as HTMLInputElement;

    const file = new File(["dummy"], "image.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileAdd).toHaveBeenCalledWith(file);
  });

  it("does not call onFileAdd for non-image files", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    const container = screen.getByText(
      /Drop your image here or/i,
    ).parentElement!;
    const input = container.querySelector("input") as HTMLInputElement;

    const file = new File(["dummy"], "text.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileAdd).not.toHaveBeenCalled();
  });

  it("updates style on drag over and drag leave", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    const container = screen.getByText(
      /Drop your image here or/i,
    ).parentElement!;

    fireEvent.dragOver(container);
    expect(screen.getByText("Drop your image here")).toBeInTheDocument();

    fireEvent.dragLeave(container);
    expect(screen.getByText(/Drop your image here or/i)).toBeInTheDocument();
  });

  it("calls onFileAdd when image is dropped", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    const container = screen.getByText(
      /Drop your image here or/i,
    ).parentElement!;

    const file = new File(["dummy"], "image.png", { type: "image/png" });
    const dataTransfer = {
      files: [file],
      items: [],
      types: ["Files"],
    };

    fireEvent.drop(container, { dataTransfer });
    expect(onFileAdd).toHaveBeenCalledWith(file);
  });

  it("does not call onFileAdd when non-image is dropped", () => {
    render(<CardDragAndDrop onFileAdd={onFileAdd} />);
    const container = screen.getByText(
      /Drop your image here or/i,
    ).parentElement!;

    const file = new File(["dummy"], "text.txt", { type: "text/plain" });
    const dataTransfer = { files: [file], items: [], types: ["Files"] };

    fireEvent.drop(container, { dataTransfer });
    expect(onFileAdd).not.toHaveBeenCalled();
  });
});
