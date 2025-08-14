/**
 * __tests__/AddProductForm.test.tsx
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddProductForm } from "@/app/(side-bar)/my-products/add-product/components/AddProductForm";

// mocks
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock(
  "@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct",
  () => ({
    useCreateProduct: jest.fn(),
  })
);

// stub createObjectURL so ImagePreviewerUploader doesn't blow up
const originalCreateObjectURL = URL.createObjectURL;
beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  URL.createObjectURL = jest.fn(() => "blob:mock-url");
});
afterAll(() => {
  // restore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  URL.createObjectURL = originalCreateObjectURL;
});

const brandOptions = [
  { value: 1, label: "Nike" },
  { value: 2, label: "Adidas" },
];
const colorOptions = [
  { value: 10, label: "White" },
  { value: 11, label: "Black" },
];
const sizeOptions = [
  { value: 40, label: 40 },
  { value: 42, label: 42 },
];

describe("AddProductForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default session mock
    const { useSession } = require("next-auth/react");
    useSession.mockReturnValue({
      data: { user: { id: "123", jwt: "token-abc" } },
    });
  });

  it("submits successfully and shows success snackbar", async () => {
    const user = userEvent.setup();

    // mock mutateAsync on the hook
    const {
      useCreateProduct,
    } = require("@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct");
    const mutateAsync = jest.fn().mockResolvedValue(undefined);
    useCreateProduct.mockReturnValue({ mutateAsync });

    render(
      <AddProductForm
        brandOptions={brandOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
      />
    );

    // fill inputs
    const nameInput = screen.getByLabelText(
      /Product name/i
    ) as HTMLInputElement;
    const priceInput = screen.getByLabelText(/Price/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      /Description/i
    ) as HTMLInputElement;

    await user.type(nameInput, "Test Shoe");
    await user.clear(priceInput);
    await user.type(priceInput, "99");
    await user.type(descriptionInput, "A nice shoe for testing");

    // click a size box
    const sizeBox = screen.getByText("EU-42");
    await user.click(sizeBox);

    // safe retrieval of the form: try queryByRole first, else fallback to id
    const possibleForm = screen.queryByRole("form", {
      hidden: true,
    }) as HTMLFormElement | null;
    const formElement =
      possibleForm ??
      (document.getElementById("add-product-form") as HTMLFormElement);

    // ensure we got the form
    expect(formElement).toBeTruthy();

    fireEvent.submit(formElement);

    // wait for mutateAsync call
    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1);
    });

    // check snackbar message
    expect(
      await screen.findByText("Product added successfully!")
    ).toBeInTheDocument();
  });

  it("shows error snackbar when mutateAsync rejects", async () => {
    const user = userEvent.setup();

    const {
      useCreateProduct,
    } = require("@/app/(side-bar)/my-products/add-product/hooks/useCreateProduct");
    const mutateAsync = jest.fn().mockRejectedValue(new Error("fail"));
    useCreateProduct.mockReturnValue({ mutateAsync });

    render(
      <AddProductForm
        brandOptions={brandOptions}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
      />
    );

    const nameInput = screen.getByLabelText(
      /Product name/i
    ) as HTMLInputElement;
    const priceInput = screen.getByLabelText(/Price/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      /Description/i
    ) as HTMLInputElement;

    await user.type(nameInput, "Test Shoe");
    await user.clear(priceInput);
    await user.type(priceInput, "10");
    await user.type(descriptionInput, "desc");

    const sizeBox = screen.getByText("EU-40");
    await user.click(sizeBox);

    const formElement = document.getElementById(
      "add-product-form"
    ) as HTMLFormElement;
    expect(formElement).toBeTruthy();

    fireEvent.submit(formElement);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByText("Failed to add product.")
    ).toBeInTheDocument();
  });
});
