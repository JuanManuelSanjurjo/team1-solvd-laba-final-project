import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import signUp from "@/actions/sign-up";
import SignUpForm from "@/app/auth/sign-up/components/SignUpForm";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "__tests__/utils/test-utils";
import { SignUpResponse } from "@/app/auth/sign-up/types";
import authMocks from "__tests__/mocks/auth";

jest.mock("@/actions/sign-up");
const mockSignUp = signUp as jest.MockedFunction<typeof signUp>;

const MOCK_USER_RESPONSE = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
};

const VALID_FORM_DATA = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
};

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

const fillValidFormData = async () => {
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: VALID_FORM_DATA.username },
  });
  fireEvent.change(screen.getByLabelText(/e-mail/i), {
    target: { value: VALID_FORM_DATA.email },
  });
  fireEvent.change(screen.getByLabelText(/^Password\s*\*?$/i), {
    target: { value: VALID_FORM_DATA.password },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: VALID_FORM_DATA.password },
  });
};

describe("SignUpForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("renders all form elements correctly", () => {
      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Password\s*\*?$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByTestId("sign-up-button")).toBeInTheDocument();
    });

    it("renders submit button with correct text", () => {
      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      const submitButton = screen.getByTestId("sign-up-button");
      expect(submitButton).toHaveTextContent("Sign Up");
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Behavior", () => {
    it("shows validation errors for invalid inputs", async () => {
      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      const submitButton = screen.getByTestId("sign-up-button");

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/username/i), {
          target: { value: "ab" },
        });
        fireEvent.change(screen.getByLabelText(/e-mail/i), {
          target: { value: "invalid-email" },
        });
        fireEvent.change(screen.getByLabelText(/^Password\s*\*?$/i), {
          target: { value: "123" },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
          target: { value: "456" },
        });
        fireEvent.click(submitButton);
        fireEvent.blur(screen.getByLabelText(/username/i));
        fireEvent.blur(screen.getByLabelText(/e-mail/i));
        fireEvent.blur(screen.getByLabelText(/^Password\s*\*?$/i));
        fireEvent.blur(screen.getByLabelText(/confirm password/i));
      });

      await waitFor(() => {
        expect(
          screen.getByText("Username must be at least 5 characters")
        ).toBeInTheDocument();
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
        expect(
          screen.getByText("Password must be at least 8 characters")
        ).toBeInTheDocument();
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      });
    });

    it("shows validation error for username with spaces", async () => {
      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      const submitButton = screen.getByTestId("sign-up-button");

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/username/i), {
          target: { value: "user name" },
        });
        fireEvent.click(submitButton);
        fireEvent.blur(screen.getByLabelText(/username/i));
      });

      await waitFor(() => {
        expect(
          screen.getByText("Username cannot contain spaces")
        ).toBeInTheDocument();
      });
    });

    it("submits form with valid data", async () => {
      mockSignUp.mockResolvedValueOnce(authMocks.success);

      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      const submitButton = screen.getByTestId("sign-up-button");

      await act(async () => {
        await fillValidFormData();
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(VALID_FORM_DATA);
      });
    });

    it("shows success message on successful submission", async () => {
      mockSignUp.mockResolvedValueOnce(authMocks.success);

      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      await act(async () => {
        await fillValidFormData();
        fireEvent.click(screen.getByTestId("sign-up-button"));
      });

      await waitFor(() => {
        expect(screen.getByText(authMocks.success.message)).toBeInTheDocument();
      });
    });

    it("shows error message on failed submission", async () => {
      const errorMessage = "Email already exists";
      mockSignUp.mockRejectedValueOnce(new Error(errorMessage));

      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      await act(async () => {
        await fillValidFormData();
        fireEvent.click(screen.getByTestId("sign-up-button"));
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("disables submit button while request is pending", async () => {
      let resolvePromise: () => boolean;
      const pendingPromise = new Promise<SignUpResponse>((resolve) => {
        resolvePromise = (): boolean => {
          resolve(authMocks.success);
          return true;
        };
      });

      mockSignUp.mockReturnValueOnce(pendingPromise);

      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      const submitButton = screen.getByTestId("sign-up-button");

      await act(async () => {
        await fillValidFormData();
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

    it("closes snackbar when close button is clicked", async () => {
      mockSignUp.mockResolvedValueOnce(authMocks.success);

      const Wrapper = createWrapper();
      render(<SignUpForm />, { wrapper: Wrapper } as any);

      await act(async () => {
        await fillValidFormData();
        fireEvent.click(screen.getByTestId("sign-up-button"));
      });

      await waitFor(() => {
        expect(
          screen.queryByText(authMocks.success.message)
        ).toBeInTheDocument();
      });

      await act(async () => {
        const closeButton = screen.getByRole("button", { name: /close/i });
        fireEvent.click(closeButton);
      });

      await waitFor(() => {
        expect(
          screen.queryByText(authMocks.success.message)
        ).not.toBeInTheDocument();
      });
    });
  });
});
