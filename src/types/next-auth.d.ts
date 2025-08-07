// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    jwt: string;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: {
      id: string;
      url: string;
    } | null;
    phone?: string | null;
    rememberMe?: boolean;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      jwt: string;
      avatar?: {
        id: string;
        url: string;
      } | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    jwt: string;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    rememberMe?: boolean;
    avatar?: {
      id: string;
      url: string;
    } | null;
  }
}
