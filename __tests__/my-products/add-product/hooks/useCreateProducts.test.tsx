import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateProduct } from "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct";

jest.mock("@/lib/actions/upload-images", () => ({
  uploadImages: jest.fn(),
}));
jest.mock("@/lib/actions/upload-product", () => ({
  createProduct: jest.fn(),
}));
jest.mock("@/lib/get-query-client", () => ({
  getQueryClient: jest.fn(),
}));
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: jest.fn(),
  },
}));

const uploadImagesMock = require("@/lib/actions/upload-images").uploadImages;
const createProductMock = require("@/lib/actions/upload-product").createProduct;
const getQueryClientMock = require("@/lib/get-query-client").getQueryClient;
const toastShowMock = jest.fn();

function TestHarness({ session }: { session: any }) {
  const mutation = useCreateProduct(session);
  return (
    <button
      data-testid="call"
      onClick={() =>
        mutation.mutate({
          data: {
            name: "Shirt",
            color: 1,
            gender: 2,
            brand: 3,
            categories: 4,
            price: 20,
            description: "desc",
            sizes: [1, 2],
            userID: 5,
          },
          imageFiles: [new File(["img"], "a.png", { type: "image/png" })],
          remainingExistentImages: [11],
        })
      }
    >
      call
    </button>
  );
}

describe("useCreateProduct hook", () => {
  let queryClient: QueryClient;
  let invalidateQueriesMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient();
    invalidateQueriesMock = jest.fn();

    getQueryClientMock.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });
    require("@/store/toastStore").useToastStore.getState.mockReturnValue({
      show: toastShowMock,
    });
  });

  test("uploads images, calls createProduct with correct args, invalidates queries and shows success toast", async () => {
    uploadImagesMock.mockResolvedValueOnce([101]);
    createProductMock.mockResolvedValueOnce(undefined);

    const session = { user: { id: "5", jwt: "tok" } } as any;

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TestHarness session={session} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId("call"));

    await waitFor(() => {
      expect(uploadImagesMock).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(File)])
      );
      expect(createProductMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "Shirt",
            images: [101, 11],
          }),
        }),
        "tok"
      );
      expect(invalidateQueriesMock).toHaveBeenCalledWith({
        queryKey: ["user-products", "5"],
      });
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "success",
        })
      );
    });
  });

  test("shows error toast on failure", async () => {
    uploadImagesMock.mockRejectedValueOnce(new Error("upload fail"));

    const session = { user: { id: "5", jwt: "tok" } } as any;

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TestHarness session={session} />
      </QueryClientProvider>
    );

    fireEvent.click(getByTestId("call"));

    await waitFor(() => {
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
        })
      );
    });
  });
});
