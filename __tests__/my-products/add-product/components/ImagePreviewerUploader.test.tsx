import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const createObjectURLMock = (file: File) => `blob:${file.name}`;

let createdWholeURL = false;
let createdCreateObjectURLOnly = false;
let spyCreateObjectURL: jest.SpyInstance | null = null;

beforeAll(() => {
  if (typeof (global as any).URL === "undefined") {
    // @ts-ignore
    global.URL = {
      createObjectURL: jest.fn(createObjectURLMock),
      revokeObjectURL: jest.fn(),
    };
    createdWholeURL = true;
    return;
  }

  if (typeof (global as any).URL.createObjectURL === "undefined") {
    // @ts-ignore
    global.URL.createObjectURL = jest.fn(createObjectURLMock);
    // @ts-ignore
    global.URL.revokeObjectURL = jest.fn();
    createdCreateObjectURLOnly = true;
    return;
  }

  spyCreateObjectURL = jest
    .spyOn((global as any).URL, "createObjectURL")
    .mockImplementation(createObjectURLMock as any);
});

afterAll(() => {
  if (spyCreateObjectURL) {
    spyCreateObjectURL.mockRestore();
    spyCreateObjectURL = null;
  }
  if (createdCreateObjectURLOnly) {
    try {
      // @ts-ignore
      delete global.URL.createObjectURL;
      // @ts-ignore
      delete global.URL.revokeObjectURL;
    } catch {}
    createdCreateObjectURLOnly = false;
  }
  if (createdWholeURL) {
    try {
      // @ts-ignore
      delete (global as any).URL;
    } catch {}
    createdWholeURL = false;
  }
});

jest.mock("@/components/cards/CardDragAndDrop", () => ({
  __esModule: true,
  default: ({ onFileAdd }: { onFileAdd: (file: File) => void }) => (
    <button
      data-testid="mock-dnd-add"
      onClick={() =>
        onFileAdd(new File(["x"], "test.png", { type: "image/png" }))
      }
    >
      add
    </button>
  ),
}));

jest.mock(
  "@/app/(side-bar)/my-products/add-product/components/RemovableImage",
  () => ({
    __esModule: true,
    default: ({
      image,
      onDeletePreview,
    }: {
      image: string;
      onDeletePreview: () => void;
    }) => (
      <div data-testid="mock-card">
        <img alt="preview" src={image} data-testid="mock-card-img" />
        <button data-testid="mock-card-delete" onClick={onDeletePreview}>
          delete
        </button>
      </div>
    ),
  })
);

jest.mock("@/components/cards/CardContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-card-container">{children}</div>
  ),
}));

import ImagePreviewerUploader from "@/app/(side-bar)/my-products/add-product/components/ImagePreviewerUploader";

describe("ImagePreviewerUploader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls onFilesChange when DnD adds a file and removes on delete", async () => {
    const onFilesChange = jest.fn();
    const onPreviewsChange = jest.fn();

    render(
      <ImagePreviewerUploader
        session={null}
        onFilesChange={onFilesChange}
        onPreviewsChange={onPreviewsChange}
      />
    );

    fireEvent.click(screen.getByTestId("mock-dnd-add"));

    await waitFor(() => {
      expect(onFilesChange).toHaveBeenCalled();
      expect(onFilesChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: "test.png" })])
      );
    });

    expect(screen.getByTestId("mock-card-img")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mock-card-delete"));

    await waitFor(() => {
      expect(onFilesChange.mock.calls.length).toBeGreaterThanOrEqual(2);
      const lastCallArg =
        onFilesChange.mock.calls[onFilesChange.mock.calls.length - 1][0];
      expect(Array.isArray(lastCallArg)).toBe(true);
      expect(lastCallArg.length).toBe(0);
    });
  });
});
