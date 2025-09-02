import React from "react";
import { render, screen } from "@testing-library/react";
import AddProduct, {
  metadata,
} from "@/app/(side-bar)/my-products/add-product/page";

const authMock = jest.fn();
jest.mock("@/auth", () => ({
  auth: (...args: any[]) => authMock(...args),
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

let lastAddFormProps: any = null;
jest.mock(
  "@/app/(side-bar)/my-products/add-product/components/AddProductForm",
  () => ({
    AddProductForm: (props: any) => {
      lastAddFormProps = props;
      return <div data-testid="add-product-form-props">AddProductFormMock</div>;
    },
  })
);

jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: (props: any) => <button {...props} />,
}));

beforeEach(() => {
  jest.clearAllMocks();
  lastAddFormProps = null;
});

describe("AddProduct page (server component)", () => {
  test("exports correct metadata.title", () => {
    expect(metadata?.title).toBe("Add new product");
  });

  test("redirects to /auth/login when user is not authenticated", async () => {
    authMock.mockResolvedValueOnce(null);

    await expect(AddProduct()).rejects.toThrow("REDIRECT:/auth/login");
    expect(redirectMock).toHaveBeenCalledWith("/auth/login");

    expect(fetchBrandsMock).not.toHaveBeenCalled();
    expect(fetchColorsMock).not.toHaveBeenCalled();
    expect(fetchSizesMock).not.toHaveBeenCalled();
    expect(fetchCategoriesMock).not.toHaveBeenCalled();
  });

  test("renders page and passes options + session to AddProductForm when authenticated", async () => {
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

    const ui = await AddProduct();
    render(ui);

    expect(screen.getByText("Add a product")).toBeInTheDocument();
    expect(
      screen.getByText(/Easily add new footwear products/i)
    ).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: /save/i });
    expect(saveBtn).toHaveAttribute("form", "add-product-form");
    expect(saveBtn).toHaveAttribute("type", "submit");

    expect(screen.getByTestId("add-product-form-props")).toBeInTheDocument();
    expect(lastAddFormProps).toBeTruthy();
    expect(lastAddFormProps.session?.user?.id).toBe("u1");
    expect(lastAddFormProps.session?.user?.jwt).toBe("tok-1");
    expect(lastAddFormProps.brandOptions).toEqual(brands);
    expect(lastAddFormProps.colorOptions).toEqual(colors);
    expect(lastAddFormProps.sizeOptions).toEqual(sizes);
    expect(lastAddFormProps.categoryOptions).toEqual(categories);

    expect(fetchBrandsMock).toHaveBeenCalledTimes(1);
    expect(fetchColorsMock).toHaveBeenCalledTimes(1);
    expect(fetchSizesMock).toHaveBeenCalledTimes(1);
    expect(fetchCategoriesMock).toHaveBeenCalledTimes(1);
  });
});
