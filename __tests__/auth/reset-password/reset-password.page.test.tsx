import "@testing-library/jest-dom";
import { render, screen } from "../../utils/test-utils";
import { QueryClient } from "@tanstack/react-query";
import ResetPasswordPage from "@/app/auth/reset-password/page";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
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

describe("Reset Password Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue("test-code-123"),
    } as any);
  });

  describe("Rendering", () => {
    it("renders all page elements correctly", () => {
      render(<ResetPasswordPage />);

      expect(screen.getByRole("main")).toBeInTheDocument();

      expect(screen.getAllByText("Reset password")).toHaveLength(2);
      expect(
        screen.getByText("Please create new password here")
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/^Password\s*\*?$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
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
      render(<ResetPasswordPage />);

      expect(
        screen.getByRole("img", { name: /logo/i }) ||
          screen.getByTestId("auth-logo")
      ).toBeInTheDocument();
    });

    it("shows error message when reset code is missing", () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue(null),
      } as any);

      render(<ResetPasswordPage />);

      expect(
        screen.getByText(
          "Invalid or missing reset code. Please check your email link and try again."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("has correct link to sign-in page", () => {
      render(<ResetPasswordPage />);

      const backToLoginLink = screen.getByRole("link", {
        name: /back to login/i,
      });
      expect(backToLoginLink).toHaveAttribute("href", "/auth/sign-in");
    });
  });
});
