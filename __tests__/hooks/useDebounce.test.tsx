import { renderHook, act } from "@testing-library/react";
import useDebounce from "@/hooks/useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("updates the value after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "b", delay: 500 });

    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("b");
  });

  it("cancels previous timeout when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "x", delay: 300 } },
    );

    rerender({ value: "y", delay: 300 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "z", delay: 300 });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe("x");

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe("z");
  });

  it("respects changes to the delay parameter", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "start", delay: 200 } },
    );

    rerender({ value: "next", delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("start");

    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(result.current).toBe("next");
  });
});
