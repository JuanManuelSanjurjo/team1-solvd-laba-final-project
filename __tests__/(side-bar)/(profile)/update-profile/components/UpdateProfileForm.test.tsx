import "@testing-library/jest-dom";
import { render, screen, waitFor } from "../../../../utils/test-utils";

import NextAuth, { AuthError } from "__tests__/mocks/auth/next-auth";
import { auth, signIn, signOut } from "__tests__/mocks/auth/auth";
import Credentials from "__tests__/mocks/auth/next-auth-providers-credentials";

import UpdateProfileForm from "@/app/(side-bar)/(profile)/update-profile/components/UpdateProfileForm";
import { updateUser } from "@/lib/actions/update-user";
import userEvent from "@testing-library/user-event";

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

jest.mock("@/lib/actions/update-user", () => ({
  updateUser: jest.fn(),
}));

const mockUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;

interface MockSession {
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    jwt: string;
    avatar: { id: string; url: string };
    customerId: null;
  };
  expires: string;
}

const mockSession: MockSession = {
  user: {
    id: "user123",
    username: "testuser",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890",
    jwt: "mock-jwt-token",
    avatar: { id: "1", url: "avatar.jpg" },
    customerId: null,
  },
  expires: "2024-12-31",
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => "/test-path"),
}));

describe("UpdateProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders form with user data", () => {
      render(<UpdateProfileForm session={mockSession} />);

      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("+1234567890")).toBeInTheDocument();
    });

    it("renders disabled email field", () => {
      render(<UpdateProfileForm session={mockSession} />);

      const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
      expect(emailInput).toBeDisabled();
    });

    it("renders save button as disabled when no changes", () => {
      render(<UpdateProfileForm session={mockSession} />);

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toBeDisabled();
    });
  });

  describe("Form Validation", () => {
    it("shows validation error for short username", async () => {
      const user = userEvent.setup();
      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByRole("textbox", { name: /username/i });
      await user.clear(usernameInput);
      await user.type(usernameInput, "abc");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/username must be at least 5 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for username with spaces", async () => {
      const user = userEvent.setup();
      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByRole("textbox", { name: /username/i });
      await user.clear(usernameInput);
      await user.type(usernameInput, "test user");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/username cannot contain spaces/i)
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for invalid phone number", async () => {
      const user = userEvent.setup();
      render(<UpdateProfileForm session={mockSession} />);

      const phoneInput = screen.getByRole("textbox", { name: /phone number/i });
      await user.clear(phoneInput);
      await user.type(phoneInput, "invalid");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid phone number/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      const user = userEvent.setup();
      mockUpdateUser.mockResolvedValue({
        error: false,
        message: "Success, details updated!",
      });

      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByRole("textbox", { name: /username/i });
      await user.clear(usernameInput);
      await user.type(usernameInput, "newusername");

      const firstNameInput = screen.getByRole("textbox", {
        name: /first name/i,
      });
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "UpdatedJohn");

      const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
      await user.clear(lastNameInput);
      await user.type(lastNameInput, "UpdatedDoe");

      const phoneInput = screen.getByRole("textbox", { name: /phone number/i });
      await user.clear(phoneInput);
      await user.type(phoneInput, "+1987654321");

      const saveButton = screen.getByTestId("save-button");
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(
          expect.objectContaining({
            username: "newusername",
            firstName: "UpdatedJohn",
            lastName: "UpdatedDoe",
            email: "test@example.com",
            phoneNumber: "+1987654321",
          }),
          "user123"
        );
      });
    });
  });

  describe("Button State", () => {
    it("enables save button when form data changes", async () => {
      const user = userEvent.setup();
      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByRole("textbox", { name: /username/i });
      await user.clear(usernameInput);
      await user.type(usernameInput, "newusername");

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).not.toBeDisabled();
    });

    it("disables save button during submission", async () => {
      const user = userEvent.setup();

      mockUpdateUser.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: false, message: "Success" }), 100)
          )
      );

      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByRole("textbox", { name: /username/i });
      await user.clear(usernameInput);
      await user.type(usernameInput, "newusername");

      const firstNameInput = screen.getByRole("textbox", {
        name: /first name/i,
      });
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "UpdatedJohn");

      const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
      await user.clear(lastNameInput);
      await user.type(lastNameInput, "UpdatedDoe");

      const saveButton = screen.getByTestId("save-button");

      await user.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });
  });
});
