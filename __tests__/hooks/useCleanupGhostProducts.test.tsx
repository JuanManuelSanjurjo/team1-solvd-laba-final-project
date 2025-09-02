import { renderHook, waitFor } from "@testing-library/react";
import {
  useClientHydrated,
  useCleanUpGhostProducts,
} from "@/app/(side-bar)/(profile)/hooks/useCleanupGhostProducts";
import { fetchActiveProductsIds } from "@/lib/actions/fetch-active-products-ids";

jest.mock("@/lib/actions/fetch-active-products-ids", () => ({
  fetchActiveProductsIds: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("useClientHydrated", () => {
  it("becomes true after mount effect", async () => {
    const { result } = renderHook(() => useClientHydrated());
    await waitFor(() => expect(result.current).toBe(true));
  });
});

describe("useCleanUpGhostProducts", () => {
  it("does nothing when ids is empty", async () => {
    const removeInactive = jest.fn();

    const { result } = renderHook(() =>
      useCleanUpGhostProducts([], removeInactive)
    );

    expect(result.current).toBe(false);
    expect(fetchActiveProductsIds).not.toHaveBeenCalled();
    expect(removeInactive).not.toHaveBeenCalled();
  });

  it("calls fetchActiveProductsIds and removes inactive ids", async () => {
    const removeInactive = jest.fn();
    (fetchActiveProductsIds as jest.Mock).mockResolvedValueOnce([1, 3]);

    const { result } = renderHook(() =>
      useCleanUpGhostProducts([1, 2, 3], removeInactive)
    );

    await waitFor(() => {
      expect(fetchActiveProductsIds).toHaveBeenCalledWith([1, 2, 3]);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    expect(removeInactive).toHaveBeenCalledTimes(1);
    expect(removeInactive).toHaveBeenCalledWith([2]);
  });

  it("does not re-run for same ids in different order (signature dedup)", async () => {
    const removeInactive = jest.fn();
    (fetchActiveProductsIds as jest.Mock).mockResolvedValue([1, 2, 3]);

    const { rerender } = renderHook(
      ({ ids }) => useCleanUpGhostProducts(ids, removeInactive),
      { initialProps: { ids: [1, 2, 3] } }
    );

    await waitFor(() => {
      expect(fetchActiveProductsIds).toHaveBeenCalledTimes(1);
    });

    rerender({ ids: [3, 2, 1] });

    await new Promise((r) => setTimeout(r, 10));
    expect(fetchActiveProductsIds).toHaveBeenCalledTimes(1);
  });

  it("re-runs when ids actually change (signature changes)", async () => {
    const removeInactive = jest.fn();
    (fetchActiveProductsIds as jest.Mock)
      .mockResolvedValueOnce([1, 2, 3])
      .mockResolvedValueOnce([1, 2, 4]);

    const { rerender } = renderHook(
      ({ ids }) => useCleanUpGhostProducts(ids, removeInactive),
      { initialProps: { ids: [1, 2, 3] } }
    );

    await waitFor(() => {
      expect(fetchActiveProductsIds).toHaveBeenCalledTimes(1);
    });

    rerender({ ids: [1, 2, 4] });

    await waitFor(() => {
      expect(fetchActiveProductsIds).toHaveBeenCalledTimes(2);
    });
  });

  it("handles errors gracefully: logs error, stops loading, does not call removeInactive", async () => {
    const removeInactive = jest.fn();

    const error = new Error("Network fail");
    (fetchActiveProductsIds as jest.Mock).mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useCleanUpGhostProducts([10, 11], removeInactive)
    );

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    expect(fetchActiveProductsIds).toHaveBeenCalledWith([10, 11]);
    expect(removeInactive).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("does not call removeInactive when all ids are active", async () => {
    const removeInactive = jest.fn();
    (fetchActiveProductsIds as jest.Mock).mockResolvedValueOnce([7, 8, 9]);

    renderHook(() => useCleanUpGhostProducts([7, 8, 9], removeInactive));

    await waitFor(() => {
      expect(fetchActiveProductsIds).toHaveBeenCalledWith([7, 8, 9]);
    });

    expect(removeInactive).not.toHaveBeenCalled();
  });
});
