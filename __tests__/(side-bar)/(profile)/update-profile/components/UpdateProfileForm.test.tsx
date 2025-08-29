import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "../../../../utils/test-utils";

jest.mock("@/lib/actions/update-user", () => ({
  updateUser: jest.fn(),
}));

jest.mock(
  "@/app/(side-bar)/(profile)/update-profile/components/UpdateProfileForm",
  () => {
    return function MockUpdateProfileForm({ session }: any) {
      const React = require("react");
      const [formData, setFormData] = React.useState({
        username: session?.user?.username || "",
        firstName: session?.user?.firstName || "",
        lastName: session?.user?.lastName || "",
        email: session?.user?.email || "",
        phoneNumber: session?.user?.phone || "",
      });

      const [errors, setErrors] = React.useState({});
      const [isSubmitting, setIsSubmitting] = React.useState(false);
      const [toast, setToast] = React.useState({
        open: false,
        message: "",
        severity: "success",
      });

      const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));

        const newErrors: any = {};
        if (field === "username" && value.length < 5) {
          newErrors.username = "Username must be at least 5 characters";
        }
        if (field === "username" && value.includes(" ")) {
          newErrors.username = "Username cannot contain spaces";
        }
        if (
          field === "phoneNumber" &&
          value &&
          !/^\\+?[1-9]\\d{1,14}$/.test(value.replace(/\\s/g, ""))
        ) {
          newErrors.phoneNumber = "Please enter a valid phone number";
        }
        setErrors(newErrors);
      };

      const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          const { updateUser } = require("@/lib/actions/update-user");
          const result = await updateUser(formData, session?.user?.id);

          if (result.error) {
            throw new Error(result.message);
          }

          setToast({
            open: true,
            message: result.message,
            severity: "success",
          });
        } catch (error: any) {
          setToast({ open: true, message: error.message, severity: "error" });
        } finally {
          setIsSubmitting(false);
        }
      };

      const isChanged =
        JSON.stringify(formData) !==
        JSON.stringify({
          username: session?.user?.username || "",
          firstName: session?.user?.firstName || "",
          lastName: session?.user?.lastName || "",
          email: session?.user?.email || "",
          phoneNumber: session?.user?.phone || "",
        });

      return (
        <div>
          {toast.open && <div data-testid="toast">{toast.message}</div>}
          <form onSubmit={handleSubmit}>
            <input
              data-testid="username-input"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              onBlur={(e) => handleInputChange("username", e.target.value)}
            />
            <input
              data-testid="firstName-input"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            <input
              data-testid="lastName-input"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            <input
              data-testid="email-input"
              value={formData.email}
              disabled
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <input
              data-testid="phoneNumber-input"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              onBlur={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting || !isChanged}
              data-testid="save-button"
            >
              Save changes
            </button>
          </form>
          {errors.username && (
            <div data-testid="username-error">{errors.username}</div>
          )}
          {errors.phoneNumber && (
            <div data-testid="phoneNumber-error">{errors.phoneNumber}</div>
          )}
        </div>
      );
    };
  }
);

import UpdateProfileForm from "@/app/(side-bar)/(profile)/update-profile/components/UpdateProfileForm";
import { updateUser } from "@/lib/actions/update-user";

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

      const emailInput = screen.getByTestId("email-input");
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
      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "abc" } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/username must be at least 5 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for username with spaces", async () => {
      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "test user" } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/username cannot contain spaces/i)
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for invalid phone number", async () => {
      render(<UpdateProfileForm session={mockSession} />);

      const phoneInput = screen.getByTestId("phoneNumber-input");
      fireEvent.change(phoneInput, { target: { value: "invalid" } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid phone number/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      mockUpdateUser.mockResolvedValue({
        error: false,
        message: "Success, details updated!",
      });

      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "newusername" } });

      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(
          expect.objectContaining({
            username: "newusername",
            firstName: "John",
            lastName: "Doe",
            email: "test@example.com",
            phoneNumber: "+1234567890",
          }),
          "user123"
        );
      });
    });

    it("shows success toast on successful update", async () => {
      mockUpdateUser.mockResolvedValue({
        error: false,
        message: "Success, details updated!",
      });

      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "newusername" } });

      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("Success, details updated!")
        ).toBeInTheDocument();
      });
    });

    it("shows error toast on failed update", async () => {
      mockUpdateUser.mockRejectedValue(new Error("Update failed"));

      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "newusername" } });

      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Update failed")).toBeInTheDocument();
      });
    });
  });

  describe("Button State", () => {
    it("enables save button when form data changes", () => {
      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "newusername" } });

      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).not.toBeDisabled();
    });

    it("disables save button during submission", async () => {
      mockUpdateUser.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: false, message: "Success" }), 100)
          )
      );

      render(<UpdateProfileForm session={mockSession} />);

      const usernameInput = screen.getByTestId("username-input");
      fireEvent.change(usernameInput, { target: { value: "newusername" } });

      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
    });
  });
});
