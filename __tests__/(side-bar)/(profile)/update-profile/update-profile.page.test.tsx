import UpdateProfile from "@/app/(side-bar)/(profile)/update-profile/page";
import { render, screen, waitFor } from "__tests__/utils/test-utils";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock(
  "@/app/(side-bar)/(profile)/update-profile/components/UpdateProfileImage",
  () => {
    return function MockUpdateProfileImage() {
      return (
        <div data-testid="update-profile-image">Update Profile Image Mock</div>
      );
    };
  }
);

jest.mock(
  "@/app/(side-bar)/(profile)/update-profile/components/UpdateProfileForm",
  () => {
    return function MockUpdateProfileForm() {
      return (
        <div data-testid="update-profile-form">Update Profile Form Mock</div>
      );
    };
  }
);

jest.mock("@/app/(side-bar)/(profile)/components/ProfileHeaderTitle", () => {
  return function MockProfileHeaderTitle({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="profile-header-title">{children}</div>;
  };
});

import { auth } from "@/auth";
const mockAuth = auth as jest.MockedFunction<any>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("UpdateProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the update profile page when user is authenticated", async () => {
    mockAuth.mockResolvedValue({
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
    } as Session);

    const UpdateProfileComponent = await UpdateProfile();
    render(UpdateProfileComponent);

    await waitFor(() => {
      expect(screen.getByTestId("profile-header-title")).toHaveTextContent(
        "My Profile"
      );
      expect(screen.getByTestId("update-profile-image")).toBeInTheDocument();
      expect(screen.getByTestId("update-profile-form")).toBeInTheDocument();
    });

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should redirect to sign-in when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await UpdateProfile();

    expect(mockRedirect).toHaveBeenCalledWith("/auth/sign-in");
  });
});
