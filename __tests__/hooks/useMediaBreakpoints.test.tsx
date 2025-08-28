import { renderHook } from "@testing-library/react";
import useMediaBreakpoints from "@/hooks/useMediaBreakpoints";
import * as mui from "@mui/material";

jest.mock("@mui/material", () => {
  const actualMui = jest.requireActual("@mui/material");
  return {
    ...actualMui,
    useTheme: jest.fn().mockReturnValue({
      breakpoints: {
        down: () => "down-sm",
        between: () => "between-sm-md",
        up: () => "up-md",
      },
    }),
    useMediaQuery: jest.fn(),
  };
});

const { useMediaQuery } = mui;

describe("useMediaBreakpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns isMobile=true", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "down-sm",
    );
    const { result } = renderHook(() => useMediaBreakpoints());
    expect(result.current).toEqual({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });
  });

  it("returns isTablet=true", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "between-sm-md",
    );
    const { result } = renderHook(() => useMediaBreakpoints());
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    });
  });

  it("returns isDesktop=true", () => {
    (useMediaQuery as jest.Mock).mockImplementation(
      (query) => query === "up-md",
    );
    const { result } = renderHook(() => useMediaBreakpoints());
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });
});
