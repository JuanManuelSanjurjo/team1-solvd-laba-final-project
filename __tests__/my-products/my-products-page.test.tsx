import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import MyProductsPage, { metadata } from "@/app/(side-bar)/my-products/page";

const authMock = jest.fn();
jest.mock("@/auth", () => ({
  auth: (arg?: unknown) => authMock(arg),
}));

const redirectMock = jest.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});
jest.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

const fetchBrandsMock = jest.fn();
const fetchColorsMock = jest.fn();
const fetchSizesMock = jest.fn();
const fetchCategoriesMock = jest.fn();

jest.mock("@/lib/actions/fetch-brands", () => ({
  fetchBrands: (...args: any[]) => fetchBrandsMock(...args),
}));
jest.mock("@/lib/actions/fetch-colors", () => ({
  fetchColors: (...args: any[]) => fetchColorsMock(...args),
}));
jest.mock("@/lib/actions/fetch-sizes", () => ({
  fetchSizes: (...args: any[]) => fetchSizesMock(...args),
}));
jest.mock("@/lib/actions/fetch-categories", () => ({
  fetchCategories: (...args: any[]) => fetchCategoriesMock(...args),
}));

let lastMainContentProps: any = null;

jest.mock("@/app/(side-bar)/my-products/components/MyProductsBanner", () => ({
  __esModule: true,
  default: () => <div data-testid="my-products-banner">Banner</div>,
}));

jest.mock(
  "@/app/(side-bar)/my-products/components/MyProductsMainContent",
  () => ({
    __esModule: true,
    default: (props: any) => {
      lastMainContentProps = props;
      return <div data-testid="my-products-main-content">MainContentMock</div>;
    },
  })
);

beforeEach(() => {
  jest.clearAllMocks();
  lastMainContentProps = null;
});

describe("MyProductsPage", () => {
  test("exports correct metadata.title", () => {
    expect(metadata?.title).toBe("My Products");
  });

  test("redirects to /auth/login when user is not authenticated", async () => {
    authMock.mockResolvedValueOnce(null);
    await expect(MyProductsPage()).rejects.toThrow("REDIRECT:/auth/login");
    expect(redirectMock).toHaveBeenCalledWith("/auth/login");

    expect(fetchBrandsMock).not.toHaveBeenCalled();
    expect(fetchColorsMock).not.toHaveBeenCalled();
    expect(fetchSizesMock).not.toHaveBeenCalled();
    expect(fetchCategoriesMock).not.toHaveBeenCalled();
  });

  test("renders banner + main content and passes session and option lists when authenticated", async () => {
    authMock.mockResolvedValueOnce({
      user: { id: "u1", jwt: "tok-1" },
    });

    const brands = [{ value: 1, label: "Nike" }];
    const colors = [{ value: 10, label: "Blue" }];
    const sizes = [{ value: 42, label: 42 }];
    const categories = [{ value: 99, label: "Running" }];

    fetchBrandsMock.mockResolvedValueOnce(brands);
    fetchColorsMock.mockResolvedValueOnce(colors);
    fetchSizesMock.mockResolvedValueOnce(sizes);
    fetchCategoriesMock.mockResolvedValueOnce(categories);

    const ui = await MyProductsPage();
    render(ui);

    expect(screen.getByTestId("my-products-banner")).toBeInTheDocument();
    expect(screen.getByTestId("my-products-main-content")).toBeInTheDocument();

    expect(lastMainContentProps).toBeTruthy();
    expect(lastMainContentProps.session?.user?.id).toBe("u1");
    expect(lastMainContentProps.session?.user?.jwt).toBe("tok-1");
    expect(lastMainContentProps.brandOptions).toEqual(brands);
    expect(lastMainContentProps.colorOptions).toEqual(colors);
    expect(lastMainContentProps.sizeOptions).toEqual(sizes);
    expect(lastMainContentProps.categoryOptions).toEqual(categories);

    expect(fetchBrandsMock).toHaveBeenCalledTimes(1);
    expect(fetchColorsMock).toHaveBeenCalledTimes(1);
    expect(fetchSizesMock).toHaveBeenCalledTimes(1);
    expect(fetchCategoriesMock).toHaveBeenCalledTimes(1);
  });
});
