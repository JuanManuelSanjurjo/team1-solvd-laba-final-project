import "@testing-library/jest-dom";
import { render, screen } from "../../utils/test-utils";
import SignInPage from "@/app/auth/sign-in/page";

jest.mock("@/app/auth/sign-in/components/SignInForm", () => {
  return function MockSignInForm() {
    return <div data-testid="sign-in-form">Sign In Form</div>;
  };
});

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return (
      <a href={href} data-testid="link">
        {children}
      </a>
    );
  };
});

jest.mock("@/app/auth/components/AsideImage", () => {
  return function MockAsideImage({
    imageUrl,
    alt,
  }: {
    imageUrl: string;
    alt: string;
  }) {
    return (
      <div data-testid="aside-image" data-image-url={imageUrl} data-alt={alt}>
        Aside Image
      </div>
    );
  };
});

jest.mock("@/app/auth/components/AuthHeader", () => {
  return function MockAuthHeader({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) {
    return (
      <div data-testid="auth-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    );
  };
});

jest.mock("@/app/auth/components/MainContainer", () => {
  return function MockMainContainer({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="main-container">{children}</div>;
  };
});

jest.mock("@/app/auth/components/LeftBoxFormContainer", () => {
  return function MockLeftBoxFormContainer({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="left-box-form-container">{children}</div>;
  };
});

jest.mock("@/app/auth/components/AuthLogo", () => {
  return function MockAuthLogo() {
    return <div data-testid="auth-logo">Auth Logo</div>;
  };
});

describe("Sign In Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Page Structure", () => {
    it("renders all main page components", () => {
      render(<SignInPage />);

      expect(screen.getByTestId("main-container")).toBeInTheDocument();
      expect(screen.getByTestId("auth-logo")).toBeInTheDocument();
      expect(screen.getByTestId("left-box-form-container")).toBeInTheDocument();
      expect(screen.getByTestId("auth-header")).toBeInTheDocument();
      expect(screen.getByTestId("sign-in-form")).toBeInTheDocument();
      expect(screen.getByTestId("aside-image")).toBeInTheDocument();
    });

    it("displays sign up link with correct text", () => {
      render(<SignInPage />);

      expect(screen.getByText(/Don.t have an account/)).toBeInTheDocument();
      expect(screen.getByText("Sign up")).toBeInTheDocument();
    });

    it("renders aside image with correct props", () => {
      render(<SignInPage />);

      const asideImage = screen.getByTestId("aside-image");
      expect(asideImage).toHaveAttribute(
        "data-image-url",
        "/assets/images/sign-in-aside.jpg"
      );
      expect(asideImage).toHaveAttribute("data-alt", "Sneakers image");
    });
  });

  describe("Navigation", () => {
    it("has correct link to sign up page", () => {
      render(<SignInPage />);

      const signUpLink = screen.getByTestId("link");
      expect(signUpLink).toHaveAttribute("href", "/auth/sign-up");
      expect(signUpLink).toHaveTextContent("Sign up");
    });
  });
});
