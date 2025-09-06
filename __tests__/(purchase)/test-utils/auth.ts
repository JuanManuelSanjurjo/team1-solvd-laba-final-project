import type { Session } from "next-auth";

export const mockSession: Session = {
  expires: new Date().toISOString(),
  user: {
    id: "user123",
    username: "testuser",
    email: "test@example.com",
    jwt: "mock-jwt-token",
    avatar: null,
    firstName: "Test",
    lastName: "User",
    phone: null,
    customerId: null,
  },
};
