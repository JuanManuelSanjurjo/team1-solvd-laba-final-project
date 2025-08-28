import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "../../utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import ForgotPasswordPage from "@/app/auth/forgot-password/page";
import forgotPassword, {
  ForgotPasswordResponse,
} from "@/lib/actions/forgot-password";
import authMocks from "__tests__/mocks/auth";

jest.mock("@/lib/actions/forgot-password");
const mockForgotPassword = forgotPassword as jest.MockedFunction<
  typeof forgotPassword
>;

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("Forgot Password Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all page elements correctly", () => {
      render(<ForgotPasswordPage />);

      expect(screen.getByRole("main")).toBeInTheDocument();

      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
      expect(
        screen.getByText("Don't worry, we'll send you reset instructions.")
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset password/i })
      ).toBeInTheDocument();

      expect(screen.getByText("Back to login")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /back to login/i })
      ).toHaveAttribute("href", "/auth/sign-in");

      expect(screen.getByAltText("Sneakers image")).toBeInTheDocument();
    });

    it("displays the logo", () => {
      render(<ForgotPasswordPage />);

      expect(
        screen.getByRole("img", { name: /logo/i }) ||
          screen.getByTestId("auth-logo")
      ).toBeInTheDocument();
    });
  });

  describe("Form Functionality", () => {
    it("validates email input", async () => {
      render(<ForgotPasswordPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole("button", {
        name: /reset password/i,
      });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.click(submitButton);
        fireEvent.blur(emailInput);
      });

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });

      expect(mockForgotPassword).not.toHaveBeenCalled();
    });

    it("submits form with valid email", async () => {
      mockForgotPassword.mockResolvedValueOnce(authMocks.success);
      render(<ForgotPasswordPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole("button", {
        name: /reset password/i,
      });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockForgotPassword).toHaveBeenCalledWith({
          email: "test@example.com",
        });
      });
    });

    it("shows success message on successful submission", async () => {
      mockForgotPassword.mockResolvedValueOnce(authMocks.success);
      render(<ForgotPasswordPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole("button", {
        name: /reset password/i,
      });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(authMocks.success.message)).toBeInTheDocument();
      });
    });

    it("shows error message on failed submission", async () => {
      const errorMessage = "Email not found";
      mockForgotPassword.mockRejectedValueOnce(new Error(errorMessage));
      render(<ForgotPasswordPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole("button", {
        name: /reset password/i,
      });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("disables submit button during submission", async () => {
      let resolvePromise: () => boolean;

      const pendingPromise = new Promise<ForgotPasswordResponse>((resolve) => {
        resolvePromise = (): boolean => {
          resolve(authMocks.success);
          return true;
        };
      });

      mockForgotPassword.mockReturnValueOnce(pendingPromise);

      render(<ForgotPasswordPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole("button", {
        name: /reset password/i,
      });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      await act(async () => {
        resolvePromise!();
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Navigation", () => {
    it("has correct link to sign-in page", () => {
      render(<ForgotPasswordPage />);

      const backToLoginLink = screen.getByRole("link", {
        name: /back to login/i,
      });
      expect(backToLoginLink).toHaveAttribute("href", "/auth/sign-in");
    });
  });
});
