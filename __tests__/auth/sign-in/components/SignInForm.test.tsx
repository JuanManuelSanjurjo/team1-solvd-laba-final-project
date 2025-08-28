import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "../../../utils/test-utils";
import SignInForm from "@/app/auth/sign-in/components/SignInForm";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("@/lib/actions/sign-in", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    refresh: mockRefresh,
  })),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return (
      <a href={href} data-testid="link">
        {children}
      </a>
    );
  };
});

import signInAction from "@/lib/actions/sign-in";
import { useRouter } from "next/navigation";
import authMocks from "__tests__/mocks/auth";
import { SignInResponse } from "@/app/auth/sign-in/types";

const mockSignInAction = signInAction as jest.MockedFunction<
  typeof signInAction
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("SignInForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any);
  });

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      mockSignInAction.mockResolvedValue(authMocks.success);

      await act(async () => {
        render(<SignInForm />);
      });

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/^password\s*\*?$/i);
      const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(rememberMeCheckbox);
      });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockSignInAction).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          rememberMe: true,
        });
      });
    });

    it("shows success message and redirects on successful sign in", async () => {
      mockSignInAction.mockResolvedValue(authMocks.success);

      await act(async () => {
        render(<SignInForm />);
      });

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/^password\s*\*?$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
      });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(authMocks.success.message)).toBeInTheDocument();
      });

      expect(mockPush).toHaveBeenCalledWith("/products");
      expect(mockRefresh).toHaveBeenCalled();
    });

    it("shows error message on failed sign in", async () => {
      const errorMessage = "Invalid credentials";
      mockSignInAction.mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        render(<SignInForm />);
      });

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/^password\s*\*?$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("disables submit button during pending request", async () => {
      let resolvePromise: () => boolean;

      const signInPromise = new Promise<SignInResponse>((resolve) => {
        resolvePromise = (): boolean => {
          resolve(authMocks.success);
          return true;
        };
      });

      mockSignInAction.mockReturnValue(signInPromise);

      await act(async () => {
        render(<SignInForm />);
      });

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/^password\s*\*?$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
      });

      await act(async () => {
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

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      render(<SignInForm />);

      const form = screen.getByRole("form") || document.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("associates error messages with inputs", async () => {
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(emailInput.getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });
    });
  });
});
