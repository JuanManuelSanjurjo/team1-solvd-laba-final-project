/**
 * @file ImagePreviewerUploader.test.tsx
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImagePreviewerUploader from "@/app/(side-bar)/my-products/add-product/components/ImagePreviewerUploader";

// Stub createObjectURL
const originalCreateObjectURL = URL.createObjectURL;
beforeAll(() => {
  (URL.createObjectURL as unknown) = jest.fn(() => "blob:mock-preview");
});
afterAll(() => {
  (URL.createObjectURL as unknown) = originalCreateObjectURL;
});

describe("ImagePreviewerUploader", () => {
  it("calls onFilesChange when an image is dropped", async () => {
    const onFilesChange = jest.fn();
    render(<ImagePreviewerUploader onFilesChange={onFilesChange} />);

    // create fake file
    const file = new File(["file-body"], "test.png", { type: "image/png" });

    // clear the initial mount call so we only assert the drop-caused call
    onFilesChange.mockClear();

    // find drop area (closest div to the instruction text)
    const dropArea = screen.getByText(/Drop your image here/i).closest("div")!;
    expect(dropArea).toBeTruthy();

    const dataTransfer = {
      files: [file],
      items: [{ kind: "file", type: "image/png", getAsFile: () => file }],
    };

    // simulate drop
    fireEvent.drop(dropArea, {
      dataTransfer,
    } as unknown as DragEvent);

    // wait until callback is called after the drop
    await waitFor(() => {
      expect(onFilesChange).toHaveBeenCalledTimes(1);
    });

    // Inspect the last call (should contain our file)
    const calledWith = onFilesChange.mock.calls[0][0] as File[];
    expect(calledWith).toHaveLength(1);
    expect(calledWith[0].name).toBe("test.png");
  });

  it("renders initial previews (URLs) without files and calls onPreviewsChange when changed", async () => {
    const onFilesChange = jest.fn();
    const onPreviewsChange = jest.fn();
    const initialPreviews = ["https://example.com/img1.png"];

    render(
      <ImagePreviewerUploader
        onFilesChange={onFilesChange}
        initialPreviews={initialPreviews}
        onPreviewsChange={onPreviewsChange}
      />
    );

    // initialPreviews should invoke the stableOnPreviewsChange in useEffect
    await waitFor(() => {
      expect(onFilesChange).toHaveBeenCalled();
      // onPreviewsChange should get the remaining URLs (initialPreviews)
      expect(onPreviewsChange).toHaveBeenCalledWith(initialPreviews);
    });

    // There should be at least one Card rendered (it uses a link internally)
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(1);
  });
});
