import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const toastShowMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({ show: toastShowMock }),
  },
}));

const uploadImagesMock = jest.fn();
const updateProductMock = jest.fn();
const deleteImageMock = jest.fn();
jest.mock("@/lib/actions/upload-images", () => ({
  uploadImages: (...args: any[]) => uploadImagesMock(...args),
}));
jest.mock("@/lib/actions/update-product", () => ({
  updateProduct: (...args: any[]) => updateProductMock(...args),
}));
jest.mock("@/lib/actions/delete-image", () => ({
  deleteImage: (...args: any[]) => deleteImageMock(...args),
}));

jest.mock("@/lib/get-query-client", () => ({ getQueryClient: jest.fn() }));

import { useUpdateProduct } from "@/app/(side-bar)/my-products/hooks/useUpdateProduct";

function TestHarness({ session }: { session: any }) {
  const mutation = useUpdateProduct(session);

  return (
    <button
      onClick={() =>
        mutation.mutateAsync({
          productId: 12,
          data: { name: "Shoe", userID: 1 } as any,
          imageFiles: [new File(["a"], "a.png", { type: "image/png" })],
          existentImages: [200],
          imagesToDelete: [300, 400],
        })
      }
      data-testid="call"
    >
      call
    </button>
  );
}

describe("useUpdateProduct hook", () => {
  let qc: QueryClient;
  beforeEach(() => {
    jest.clearAllMocks();
    qc = new QueryClient();
    (
      require("@/lib/get-query-client").getQueryClient as jest.Mock
    ).mockReturnValue(qc);
  });

  test("uploads images, calls updateProduct, invalidates queries and shows success toast", async () => {
    uploadImagesMock.mockResolvedValueOnce([101]);
    updateProductMock.mockResolvedValueOnce(undefined);
    deleteImageMock.mockResolvedValue(undefined);

    const session = { user: { id: "5", jwt: "tok" } } as any;
    const { getByTestId } = render(
      <QueryClientProvider client={qc}>
        <TestHarness session={session} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId("call"));

    await waitFor(() => {
      expect(uploadImagesMock).toHaveBeenCalled();
      expect(updateProductMock).toHaveBeenCalled();
      expect(
        require("@/lib/get-query-client").getQueryClient
      ).toHaveBeenCalled();
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "success",
          message: "Product edited succesfully",
        })
      );
    });
  });

  test("if deleteImage fails for some id, shows error toast for that id (but continues)", async () => {
    uploadImagesMock.mockResolvedValueOnce([]);
    updateProductMock.mockResolvedValueOnce(undefined);
    deleteImageMock
      .mockImplementationOnce(() =>
        Promise.reject(new Error("fail delete 300"))
      )
      .mockImplementationOnce(() => Promise.resolve(undefined));

    const session = { user: { id: "5", jwt: "tok" } } as any;
    const { getByTestId } = render(
      <QueryClientProvider client={qc}>
        <TestHarness session={session} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId("call"));

    await waitFor(() => {
      expect(updateProductMock).toHaveBeenCalled();
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          message: expect.stringContaining("Failed to delete image"),
        })
      );
    });
  });
});
