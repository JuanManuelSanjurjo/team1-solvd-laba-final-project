import React from "react";
import { renderHook, act } from "@testing-library/react";
import useSearchMyProducts from "@/app/(side-bar)/my-products/hooks/useSearchMyProducts";

const pushMock = jest.fn();
const pathnameMock = "/my-products";
const searchParamsEntries: [string, string][] = [];

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({
    entries: () => searchParamsEntries[Symbol.iterator](),
    get: (k: string) => null,
  }),
  usePathname: () => pathnameMock,
}));

describe("useSearchMyProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handleSearchInputChange updates searchInput", () => {
    const { result } = renderHook(() => useSearchMyProducts());

    act(() => {
      const fakeEvent = {
        target: { value: "shoes" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      result.current.handleSearchInputChange(fakeEvent);
    });

    expect(result.current.searchInput).toBe("shoes");
  });

  test("handleSearchSubmit pushes correct url when input present", () => {
    const { result } = renderHook(() => useSearchMyProducts());

    act(() => {
      const fakeEvent = {
        target: { value: "shoes" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      result.current.handleSearchInputChange(fakeEvent);
    });

    act(() => {
      const formEvent = {
        preventDefault: () => {},
      } as unknown as React.FormEvent<HTMLFormElement>;
      result.current.handleSearchSubmit(formEvent);
    });

    expect(pushMock).toHaveBeenCalledWith(
      `/my-products?searchTerm=shoes&page=1`
    );
  });

  test("deleteSearchTerm clears input and pushes url without searchTerm", () => {
    const { result } = renderHook(() => useSearchMyProducts());

    act(() => {
      const fakeEvent = {
        target: { value: "shoes" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      result.current.handleSearchInputChange(fakeEvent);
    });

    act(() => {
      result.current.deleteSearchTerm();
    });

    expect(result.current.searchInput).toBe("");
    expect(pushMock).toHaveBeenCalledWith(`/my-products?page=1`);
  });
});
