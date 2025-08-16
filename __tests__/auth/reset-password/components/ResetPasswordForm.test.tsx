import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "../../../utils/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import resetPassword from "@/actions/reset-password";
import ResetPasswordForm from "@/app/auth/reset-password/components/ResetPasswordForm";
import { useSearchParams } from "next/navigation";
import authMocks from "__tests__/mocks/auth";

jest.mock("@/actions/reset-password");
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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("ResetPasswordForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue("test-code-123"),
    } as any);
  });

  it("renders password input with correct attributes", () => {
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

    const passwordInput = screen.getByLabelText(/^Password\s*\*?$/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  it("renders confirm password input with correct attributes", () => {
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("required");
    expect(confirmPasswordInput).toHaveAttribute("name", "confirmPassword");
  });

  it("renders submit button with correct text and type", () => {
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).toHaveTextContent("Reset password");
    expect(submitButton).not.toBeDisabled();
  });

  it("renders form with proper structure", () => {
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

    const form = screen.getByRole("form") || document.querySelector("form");
    expect(form).toBeInTheDocument();

    const hiddenCodeInput = document.querySelector(
      'input[name="code"][type="hidden"]'
    );
    expect(hiddenCodeInput).toBeInTheDocument();
  });

  it("has proper accessibility labels and structure", () => {
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);

    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

    expect(
      screen.getByText(
        "Invalid or missing reset code. Please check your email link and try again."
      )
    ).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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
    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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

    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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

    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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

    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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

    const Wrapper = createWrapper();
    render(<ResetPasswordForm />, { wrapper: Wrapper } as any);

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
