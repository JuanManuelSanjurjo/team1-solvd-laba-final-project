import { useSession } from "next-auth/react";
import { mockSession } from "./auth";

export const mockUseSession = useSession as jest.Mock;

export const mockAuthenticatedSession = (session = mockSession) => {
  mockUseSession.mockReturnValue({
    data: session,
    update: jest.fn(),
    status: "authenticated",
  });
};

export const mockUnauthenticatedSession = () => {
  mockUseSession.mockReturnValue({
    data: null,
    update: jest.fn(),
    status: "unauthenticated",
  });
};
