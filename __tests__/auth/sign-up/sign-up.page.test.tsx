import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "../../utils/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUpPage from "@/app/auth/sign-up/page";
import signUp from "@/lib/actions/sign-up";

jest.mock("@/lib/actions/sign-up");
const mockSignUp = signUp as jest.MockedFunction<typeof signUp>;

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => {
  return function MockImage({ src, alt, fill, ...props }: any) {
    const { fill: _, ...domProps } = { fill, ...props };
    return <img src={src} alt={alt} {...domProps} />;
  };
});

describe("Sign Up Page", () => {
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

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe("Rendering", () => {
    it("renders all page elements correctly", () => {
      renderWithQueryClient(<SignUpPage />);

      expect(screen.getByRole("main")).toBeInTheDocument();

      expect(screen.getByText("Create an account")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Create an account to get an easy access to your dream shopping"
        )
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password\s*\*?$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).toBeInTheDocument();

      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByText("Log in")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
        "href",
        "/auth/sign-in"
      );

      expect(screen.getByAltText("Sneakers image")).toBeInTheDocument();
    });

    it("displays the logo", () => {
      renderWithQueryClient(<SignUpPage />);

      expect(
        screen.getByRole("img", { name: /logo/i }) ||
          screen.getByTestId("auth-logo")
      ).toBeInTheDocument();
    });

    it("renders testimonials component", () => {
      renderWithQueryClient(<SignUpPage />);

      expect(screen.getByTestId("navigation-arrows")).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("submits form with valid data", async () => {
      const mockResponse = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };
      mockSignUp.mockResolvedValue(mockResponse);

      renderWithQueryClient(<SignUpPage />);

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/^password\s*\*?$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /sign up/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, {
          target: { value: "password123" },
        });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("displays validation errors for invalid inputs", async () => {
      renderWithQueryClient(<SignUpPage />);

      const submitButton = screen.getByRole("button", { name: /sign up/i });

      await act(async () => {
        fireEvent.click(submitButton);
        fireEvent.blur(screen.getByLabelText(/e-mail/i));
        fireEvent.blur(screen.getByLabelText(/username/i));
        fireEvent.blur(screen.getByLabelText(/^password\s*\*?$/i));
      });

      await waitFor(() => {
        expect(
          screen.getByText("Username must be at least 5 characters")
        ).toBeInTheDocument();
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
        expect(
          screen.getByText("Password must be at least 8 characters")
        ).toBeInTheDocument();
      });
    });

    it("handles sign-up errors", async () => {
      const errorMessage = "Username already taken";
      mockSignUp.mockRejectedValue(new Error(errorMessage));

      renderWithQueryClient(<SignUpPage />);

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/^password\s*\*?$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /sign up/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, {
          target: { value: "password123" },
        });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("has correct link to sign-in page", () => {
      renderWithQueryClient(<SignUpPage />);

      const signInLink = screen.getByRole("link", { name: /log in/i });
      expect(signInLink).toHaveAttribute("href", "/auth/sign-in");
    });
  });
});
