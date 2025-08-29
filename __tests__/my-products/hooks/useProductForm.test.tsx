import { ProductFormData } from "@/app/(side-bar)/my-products/add-product/types";
import { useProductForm } from "@/app/(side-bar)/my-products/hooks/useProductForm";
import { renderHook, act } from "@testing-library/react";

describe("useProductForm", () => {
  it("provides sensible default values", () => {
    const { result } = renderHook(() => useProductForm());

    const values = result.current.getValues();

    expect(values).toEqual(
      expect.objectContaining({
        name: "",
        color: 0,
        gender: 0,
        brand: 0,
        categories: 0,
        price: 0,
        description: "",
        sizes: [],
        userID: 0,
      })
    );
  });

  it("merges initialDefaults into form state", () => {
    const { result } = renderHook(() =>
      useProductForm({
        name: "Sneaker",
        color: 1,
        brand: 2,
        gender: 3,
        categories: 4,
        price: 99,
        description: "test desc",
        sizes: [7, 9],
        userID: 42,
      })
    );

    const values = result.current.getValues();
    expect(values).toMatchObject({
      name: "Sneaker",
      color: 1,
      brand: 2,
      gender: 3,
      categories: 4,
      price: 99,
      description: "test desc",
      sizes: [7, 9],
      userID: 42,
    });
  });

  it("toggleSize adds and removes sizes", () => {
    const { result } = renderHook(() => useProductForm({ sizes: [] }));

    act(() => {
      result.current.toggleSize(8);
    });
    expect(result.current.getValues("sizes")).toContain(8);

    act(() => {
      result.current.toggleSize(8);
    });
    expect(result.current.getValues("sizes")).not.toContain(8);
  });

  it("returns validation errors when schema fails", async () => {
    const { result } = renderHook(() => useProductForm());

    let onValid = jest.fn();
    let onInvalid = jest.fn();

    await act(async () => {
      await result.current.handleSubmit(
        onValid,
        onInvalid
      )({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
    expect(result.current.errors).toBeDefined();
  });

  it("can reset form values", () => {
    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.setValue("name", "Old");
    });
    expect(result.current.getValues("name")).toBe("Old");

    act(() => {
      result.current.reset({ name: "Reset Name" } as Partial<ProductFormData>);
    });
    expect(result.current.getValues("name")).toBe("Reset Name");
  });
});
