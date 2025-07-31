// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    jwt: string;
    rememberMe?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      jwt: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    jwt: string;
    rememberMe?: boolean;
  }
}
