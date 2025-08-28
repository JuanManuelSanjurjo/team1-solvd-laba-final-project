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
const createProductMock = jest.fn();

jest.mock("@/lib/actions/upload-images", () => ({
  uploadImages: (...args: any[]) => uploadImagesMock(...args),
}));

jest.mock("@/lib/actions/upload-product", () => ({
  createProduct: (...args: any[]) => createProductMock(...args),
}));

jest.mock("@/lib/get-query-client", () => ({
  getQueryClient: jest.fn(),
}));

import { useCreateProduct } from "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct"; // adjust path if needed

function TestHarness({ session }: { session: any }) {
  const mutation = useCreateProduct(session);

  return (
    <button
      onClick={() =>
        mutation.mutateAsync({
          data: { name: "Shoe", userID: 1 } as any,
          imageFiles: [new File(["a"], "a.png", { type: "image/png" })],
          remainingExistentImages: [],
        })
      }
      data-testid="call"
    >
      call
    </button>
  );
}

describe("useCreateProduct hook", () => {
  let qc: QueryClient;
  beforeEach(() => {
    jest.clearAllMocks();
    qc = new QueryClient();
    (
      require("@/lib/get-query-client").getQueryClient as jest.Mock
    ).mockReturnValue(qc);
  });

  test("uploads images, calls createProduct, invalidates queries and shows toast", async () => {
    uploadImagesMock.mockResolvedValueOnce([101]);
    createProductMock.mockResolvedValueOnce(undefined);

    const session = { user: { id: "5", jwt: "tok" } } as any;

    const { getByTestId } = render(
      <QueryClientProvider client={qc}>
        <TestHarness session={session} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId("call"));

    await waitFor(() => {
      expect(uploadImagesMock).toHaveBeenCalled();
      expect(createProductMock).toHaveBeenCalled();
      expect(
        require("@/lib/get-query-client").getQueryClient
      ).toHaveBeenCalled();
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "success",
          message: "Product added successfully!",
        })
      );
    });
  });
});
