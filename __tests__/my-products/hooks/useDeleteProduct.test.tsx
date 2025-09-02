import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deleteProduct } from "@/lib/actions/delete-product";
import { deleteImage } from "@/lib/actions/delete-image";
import { getQueryClient } from "@/lib/get-query-client";
import { useDeleteProduct } from "@/app/(side-bar)/my-products/hooks/useDeleteProduct";
import { waitFor } from "@testing-library/react";

jest.mock("@/lib/actions/delete-product", () => ({
  deleteProduct: jest.fn(),
}));
jest.mock("@/lib/actions/delete-image", () => ({
  deleteImage: jest.fn(),
}));
jest.mock("@/lib/get-query-client", () => ({
  getQueryClient: jest.fn(),
}));

const showToastMock = jest.fn();
jest.mock("@/store/toastStore", () => {
  const mockStore = Object.assign(
    ((...args: any[]) => (args[0] ? args[0]({}) : {})) as any,
    {
      getState: () => ({ show: showToastMock }),
    }
  );
  return { useToastStore: mockStore };
});

describe("useDeleteProduct", () => {
  let queryClient: QueryClient;
  const invalidateQueriesMock = jest.fn();

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    queryClient = new QueryClient();
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });
    (deleteProduct as jest.Mock).mockResolvedValue(undefined);
    (deleteImage as jest.Mock).mockResolvedValue(undefined);
  });

  test("success flow: deletes product, deletes images, goes back one page, invalidates queries, and shows success toast", async () => {
    const session = {
      user: { id: "u1", jwt: "token-123" },
      expires: "",
    };
    const setPageMock = jest.fn();

    const { result } = renderHook(
      () =>
        useDeleteProduct({
          session: session as any,
          setPage: setPageMock,
          currentPage: 2,
          productsLength: 1,
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutateAsync({ productId: 42, imageIds: [100, 200] });
    });

    expect(deleteProduct).toHaveBeenCalledWith(42, "token-123");
    expect(setPageMock).toHaveBeenCalledWith(1);
    expect(deleteImage).toHaveBeenCalledTimes(2);
    expect(deleteImage).toHaveBeenNthCalledWith(1, 100, "token-123");
    expect(deleteImage).toHaveBeenNthCalledWith(2, 200, "token-123");
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["user-products", "u1"],
    });
    expect(showToastMock).toHaveBeenCalledWith({
      severity: "success",
      message: "Product deleted succesfully",
    });
  });

  test("error when missing token: rejects mutation, does not call actions, and shows error toast", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const session = {
      user: { id: "u1", jwt: undefined },
      expires: "",
    };
    const setPageMock = jest.fn();

    const { result } = renderHook(
      () =>
        useDeleteProduct({
          session: session as any,
          setPage: setPageMock,
          currentPage: 1,
          productsLength: 5,
        }),
      { wrapper }
    );

    await expect(result.current.mutateAsync({ productId: 1 })).rejects.toThrow(
      "User not authenticated (missing token)"
    );

    expect(deleteProduct).not.toHaveBeenCalled();
    expect(deleteImage).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(showToastMock).toHaveBeenCalledWith({
        severity: "error",
        message: "Failed to delete product",
      })
    );

    expect(invalidateQueriesMock).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("partial failure when deleting an image: logs error but still invalidates queries and shows success toast", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (deleteImage as jest.Mock)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("boom-image"));

    const session = {
      user: { id: "u9", jwt: "t-999" },
      expires: "",
    };
    const setPageMock = jest.fn();

    const { result } = renderHook(
      () =>
        useDeleteProduct({
          session: session as any,
          setPage: setPageMock,
          currentPage: 3,
          productsLength: 2,
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.mutateAsync({
        productId: 77,
        imageIds: [11, 22],
      });
    });

    expect(deleteProduct).toHaveBeenCalledWith(77, "t-999");
    expect(deleteImage).toHaveBeenNthCalledWith(1, 11, "t-999");
    expect(deleteImage).toHaveBeenNthCalledWith(2, 22, "t-999");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to delete image 22:"),
      expect.any(Error)
    );
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["user-products", "u9"],
    });
    expect(showToastMock).toHaveBeenCalledWith({
      severity: "success",
      message: "Product deleted succesfully",
    });

    consoleErrorSpy.mockRestore();
  });
});
