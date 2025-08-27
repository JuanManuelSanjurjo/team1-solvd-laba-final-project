// __tests__/my-products/add-product/components/ImagePreviewerUploader.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// local mock for URL.createObjectURL — only in this test file
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

/**
 * IMPORTANT:
 * Mock the exact modules that ImagePreviewerUploader imports.
 * Based on your src tree these are the likely specifiers — change them
 * only if ImagePreviewerUploader imports from different strings.
 */
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

jest.mock("@/components/cards/Card", () => ({
  __esModule: true,
  default: ({
    image,
    onDeletePreview,
    showText,
  }: {
    image: string;
    onDeletePreview: () => void;
    showText: boolean;
  }) => (
    <div data-testid="mock-card">
      <img alt="preview" src={image} data-testid="mock-card-img" />
      <button data-testid="mock-card-delete" onClick={onDeletePreview}>
        delete
      </button>
      {showText ? <span>text</span> : null}
    </div>
  ),
}));

jest.mock("@/components/cards/CardContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-card-container">{children}</div>
  ),
}));

// Import the component under test (adjust only if this path is actually different)
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

    // Simulate adding via DnD mock
    fireEvent.click(screen.getByTestId("mock-dnd-add"));

    // The component's effect should call onFilesChange with an array that contains our File
    await waitFor(() => {
      expect(onFilesChange).toHaveBeenCalled();
      // more robust assertion: array containing a file with name "test.png"
      expect(onFilesChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: "test.png" })])
      );
    });

    // There should be a Card rendered (mock)
    expect(screen.getByTestId("mock-card-img")).toBeInTheDocument();

    // Click delete and expect onFilesChange to be called again with empty array
    fireEvent.click(screen.getByTestId("mock-card-delete"));

    await waitFor(() => {
      // onFilesChange called at least twice (first add, then after delete)
      expect(onFilesChange.mock.calls.length).toBeGreaterThanOrEqual(2);
      const lastCallArg =
        onFilesChange.mock.calls[onFilesChange.mock.calls.length - 1][0];
      expect(Array.isArray(lastCallArg)).toBe(true);
      expect(lastCallArg.length).toBe(0);
    });
  });
});
