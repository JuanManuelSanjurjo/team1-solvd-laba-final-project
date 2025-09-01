import RootLayout from "@/app/layout";
import { render, screen } from "./utils/test-utils";

import NextAuth, { AuthError } from "__tests__/mocks/auth/next-auth";
import { auth, signIn, signOut } from "__tests__/mocks/auth/auth";
import Credentials from "./mocks/auth/next-auth-providers-credentials";

jest.mock("next-auth", () => ({
  default: NextAuth,
  auth,
  signIn,
  signOut,
  Credentials,
  AuthError,
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
    update: jest.fn(),
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/auth", () => ({
  auth: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/components/header/Header", () => {
  return {
    Header: function MockHeader() {
      return <div data-testid="header">Header Mock</div>;
    },
  };
});

describe("Root Layout", () => {
  it("should render without crashing", async () => {
    const rootLayoutElement = await RootLayout({
      children: <div>Test Content</div>,
    });

    render(rootLayoutElement);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
