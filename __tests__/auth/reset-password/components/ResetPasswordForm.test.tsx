import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "../../../utils/test-utils";
import resetPassword from "@/lib/actions/reset-password";
import ResetPasswordForm from "@/app/auth/reset-password/components/ResetPasswordForm";
import { useSearchParams } from "next/navigation";
import authMocks from "__tests__/mocks/auth";

jest.mock("@/lib/actions/reset-password");
const mockResetPassword = resetPassword as jest.MockedFunction<
  typeof resetPassword
>;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("ResetPasswordForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue("test-code-123"),
    } as any);

    render(<ResetPasswordForm />);
  });

  it("renders password input with correct attributes", () => {
    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  it("renders confirm password input with correct attributes", () => {
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("required");
    expect(confirmPasswordInput).toHaveAttribute("name", "confirmPassword");
  });

  it("renders submit button with correct text and type", () => {
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toHaveTextContent("Reset password");
    expect(submitButton).not.toBeDisabled();
  });

  it("renders form with proper structure", () => {
    const form = screen.getByRole("form") || document.querySelector("form");
    expect(form).toBeInTheDocument();

    const hiddenCodeInput = document.querySelector(
      'input[name="code"][type="hidden"]'
    );
    expect(hiddenCodeInput).toBeInTheDocument();
  });

  it("has proper accessibility labels and structure", () => {
    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    expect(passwordInput.getAttribute("aria-invalid")).toBe("false");
    expect(confirmPasswordInput.getAttribute("aria-invalid")).toBe("false");
  });

  it("renders all form elements in correct order", () => {
    const formElements = [
      screen.getByLabelText(/^Password\s*\*?$/i),
      screen.getByLabelText(/confirm password/i),
      screen.getByRole("button", { name: /reset password/i }),
    ];

    formElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(
      passwordInput.compareDocumentPosition(confirmPasswordInput) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("shows error message when code is missing", () => {
    cleanup();

    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);

    render(<ResetPasswordForm />);

    expect(
      screen.getByText(/invalid or missing reset code/i)
    ).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when passwords do not match", async () => {
    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "different123" },
    });
    fireEvent.click(submitButton);
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    mockResetPassword.mockResolvedValueOnce(authMocks.success);

    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        password: "newpassword123",
        passwordConfirmation: "newpassword123",
        code: "test-code-123",
      });
    });
  });

  it("shows success message on successful submission", async () => {
    mockResetPassword.mockResolvedValueOnce(authMocks.success);

    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(authMocks.success.message)).toBeInTheDocument();
    });
  });

  it("shows error message on failed submission", async () => {
    const errorMessage = "Invalid reset code";
    mockResetPassword.mockRejectedValueOnce(new Error(errorMessage));

    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("closes snackbar when close button is clicked", async () => {
    mockResetPassword.mockResolvedValueOnce(authMocks.success);

    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(authMocks.success.message)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(authMocks.success.message)
      ).not.toBeInTheDocument();
    });
  });
});
