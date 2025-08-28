import React from "react";
import { waitFor, fireEvent } from "@testing-library/react";
import { render } from "__tests__/utils/test-utils";

const toastShowMock = jest.fn();
jest.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({ show: toastShowMock }),
  },
}));

jest.mock("@/app/(side-bar)/my-products/hooks/useProductForm", () => ({
  useProductForm: jest.fn(() => {
    const { useForm } = require("react-hook-form");

    const methods = useForm({
      defaultValues: {
        name: "Sneaker",
        color: 1,
        brand: 2,
        categories: 3,
        gender: 4,
        price: 100,
        description: "",
        sizes: [],
      },
    });

    return {
      register: methods.register,
      control: methods.control,
      errors: {},
      selectedSizes: [],
      toggleSize: jest.fn(),
      handleSubmit: (fn: any) => (e: any) => {
        e?.preventDefault?.();
        return fn(methods.getValues());
      },
      setValue: methods.setValue,
      getValues: methods.getValues,
      setError: methods.setError,
      reset: methods.reset,
    };
  }),
}));

const previewsMock = {
  getNewFiles: jest.fn(() => [] as File[]),
  getRemainingUrls: jest.fn(() => ["https://img/1.jpg"]),
  reset: jest.fn(),
  setImageFiles: jest.fn(),
  setExistentImages: jest.fn(),
};
jest.mock("@/app/(side-bar)/my-products/hooks/useImagePreviews", () => ({
  useImagePreviews: jest.fn(() => previewsMock),
}));

const fakeFile = new File(["x"], "img.jpg", { type: "image/jpeg" });
jest.mock("@/lib/url-utils", () => ({
  urlToFile: jest.fn(() => Promise.resolve(fakeFile)),
}));

const createMutateAsync = jest.fn();
const updateMutateAsync = jest.fn();
jest.mock(
  "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct",
  () => ({
    useCreateProduct: jest.fn(() => ({ mutateAsync: createMutateAsync })),
  })
);
jest.mock("@/app/(side-bar)/my-products/hooks/useUpdateProduct", () => ({
  useUpdateProduct: jest.fn(() => ({ mutateAsync: updateMutateAsync })),
}));

const useProductFormMock = jest.fn((initialDefaults?: any) => {
  const { useForm } = require("react-hook-form");
  const methods = useForm({
    defaultValues: {
      name: initialDefaults?.name ?? "",
      color: initialDefaults?.color ?? 0,
      gender: initialDefaults?.gender ?? 0,
      brand: initialDefaults?.brand ?? 0,
      price: initialDefaults?.price ?? 0,
      categories: initialDefaults?.categories ?? 0,
      description: initialDefaults?.description ?? "",
      sizes: initialDefaults?.sizes ?? [],
      userID: initialDefaults?.userID ?? 0,
      ...initialDefaults,
    },
  });

  return {
    register: methods.register,
    control: methods.control,
    errors: {},
    selectedSizes: initialDefaults?.sizes ?? [],
    toggleSize: jest.fn(),
    handleSubmit: (fn: any) => (e: any) => {
      e?.preventDefault?.();
      return fn(methods.getValues());
    },
    setValue: methods.setValue,
    getValues: methods.getValues,
    setError: methods.setError,
    reset: methods.reset,
  };
});
jest.mock("@/app/(side-bar)/my-products/hooks/useProductForm", () => ({
  useProductForm: (args?: any) => useProductFormMock(args),
}));

import { EditProductForm } from "@/app/(side-bar)/my-products/components/EditProductForm";

describe("EditProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const session = { user: { id: "5", jwt: "token" } } as any;

  const sampleProduct = {
    id: 99,
    name: "Shoe",
    color: { id: 1 },
    gender: { id: 4 },
    brand: { id: 2 },
    price: 50,
    description: "desc",
    images: [
      { id: 10, url: "https://img/1.jpg" },
      { id: 11, url: "https://img/2.jpg" },
    ],
    categories: [{ id: 3 }],
    sizes: [{ id: 8 }],
  } as any;

  test("edit mode: calls update mutation and onSuccess", async () => {
    updateMutateAsync.mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();

    render(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="duplicate"
        onSuccess={jest.fn()}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("duplicate mode: calls create mutation with duplicated files and onSuccess", async () => {
    createMutateAsync.mockResolvedValueOnce(undefined);

    const onSuccess = jest.fn();

    render(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="duplicate"
        onSuccess={onSuccess}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        require("@/lib/url-utils").urlToFile as jest.Mock
      ).toHaveBeenCalled();
      expect(createMutateAsync).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test("edit mode: shows toast on update failure", async () => {
    updateMutateAsync.mockRejectedValueOnce(new Error("fail update"));

    const onSuccess = jest.fn();

    render(
      <EditProductForm
        session={session}
        brandOptions={[{ value: 2, label: "ACME" }]}
        colorOptions={[{ value: 1, label: "Red" }]}
        sizeOptions={[{ value: 8, label: 8 }]}
        categoryOptions={[{ value: 3, label: "Shoes" }]}
        product={sampleProduct}
        mode="edit"
        onSuccess={jest.fn()}
      />
    );

    const form = document.querySelector("#edit-product-form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalled();
      expect(toastShowMock).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          message: "Failed to update product",
        })
      );
    });
  });
});
