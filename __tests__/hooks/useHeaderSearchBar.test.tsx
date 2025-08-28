import { renderHook, act } from "@testing-library/react";
import useHeaderSearch from "@/hooks/useHeaderSearch";
import { useQuery, useMutation } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: pushMock,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("@/hooks/useDebounce", () => jest.fn());

describe("useHeaderSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useDebounce as jest.Mock).mockImplementation((val) => val);

    (useQuery as jest.Mock).mockReturnValue({ data: [] });
    (useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  it("initial state", () => {
    const { result } = renderHook(() => useHeaderSearch());
    expect(result.current.isSearching).toBe(false);
    expect(result.current.searchInput).toBe("");
    expect(result.current.open).toBe(false);
    expect(result.current.searchResults).toEqual([]);
  });

  it("toggleSearch clears input and toggles isSearching", () => {
    const { result } = renderHook(() => useHeaderSearch());

    act(() => result.current.toggleSearch());
    expect(result.current.isSearching).toBe(true);
    expect(result.current.searchInput).toBe("");

    act(() => result.current.toggleSearch());
    expect(result.current.isSearching).toBe(false);
  });

  it("handleSearchInputChange updates searchInput", () => {
    const { result } = renderHook(() => useHeaderSearch());
    const event = {
      target: { value: "shoes" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => result.current.handleSearchInputChange(event));
    expect(result.current.searchInput).toBe("shoes");
  });

  it("handleSearchSubmit prevents default and pushes router", async () => {
    const { result } = renderHook(() => useHeaderSearch());
    const event = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      result.current.handleSearchInputChange({
        target: { value: "shoes" },
      } as any);
    });

    await act(async () => {
      result.current.handleSearchSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/products?searchTerm=shoes");
    expect(result.current.isSearching).toBe(false);
  });

  it("handleEscapeKey sets isSearching to false on Escape", () => {
    const { result } = renderHook(() => useHeaderSearch());
    act(() => result.current.toggleSearch());
    expect(result.current.isSearching).toBe(true);

    act(() => result.current.handleEscapeKey({ key: "Escape" } as any));
    expect(result.current.isSearching).toBe(false);
  });

  it("handleToggleDrawer toggles open state", () => {
    const { result } = renderHook(() => useHeaderSearch());
    expect(result.current.open).toBe(false);

    act(() => result.current.handleToggleDrawer());
    expect(result.current.open).toBe(true);

    act(() => result.current.handleToggleDrawer());
    expect(result.current.open).toBe(false);
  });

  it("generateFiltersWithAI calls mutation.mutate with trimmed input", () => {
    const mutateMock = jest.fn();
    (useMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => useHeaderSearch());

    act(() =>
      result.current.handleSearchInputChange({
        target: { value: " test " },
      } as any),
    );

    act(() => result.current.generateFiltersWithAI());

    expect(mutateMock).toHaveBeenCalledWith("test");
  });
});
