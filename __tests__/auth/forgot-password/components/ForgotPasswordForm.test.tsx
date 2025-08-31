import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "../../../utils/test-utils";
import forgotPassword, {
  ForgotPasswordResponse,
} from "@/lib/actions/forgot-password";
import ForgotPasswordForm from "@/app/auth/forgot-password/components/ForgotPasswordForm";
import authMocks from "__tests__/mocks/auth";

jest.mock("@/lib/actions/forgot-password");
const mockforgotPassword = forgotPassword as jest.MockedFunction<
  typeof forgotPassword
>;

describe("ForgotPasswordForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form elements correctly", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("submits form with valid email", async () => {
    mockforgotPassword.mockResolvedValueOnce(authMocks.success);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockforgotPassword).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  it("shows success message on successful submission", async () => {
    mockforgotPassword.mockResolvedValueOnce(authMocks.success);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Success")).toBeInTheDocument();
    });
  });

  it("shows error message on failed submission", async () => {
    const errorMessage = "Network error";
    mockforgotPassword.mockRejectedValueOnce(new Error(errorMessage));

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("disables submit button while request is pending", async () => {
    let resolvePromise: () => boolean;
    const pendingPromise = new Promise<ForgotPasswordResponse>((resolve) => {
      resolvePromise = (): boolean => {
        resolve(authMocks.success);
        return true;
      };
    });

    mockforgotPassword.mockReturnValueOnce(pendingPromise);

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    resolvePromise!();
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
