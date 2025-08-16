import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const DEFAULT_SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

interface SignInResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    avatar: {
      id: number;
      url: string;
    } | null;
  };
}

interface SignInError {
  status: number;
  name: string;
  message: string;
  details: Record<string, unknown>;
}

interface ErrorResponse {
  data: null;
  error: SignInError;
}

const getUserInfo = async (jwt: string): Promise<SignInResponse["user"]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me?populate=*`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  return await response.json();
};

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            const errorData = data as ErrorResponse;
            throw new CredentialsSignin(errorData.error.message);
          }

          const signInData = data as SignInResponse;

          const extraInfo = await getUserInfo(signInData.jwt);

          return {
            jwt: signInData.jwt,
            id: extraInfo.id.toString(),
            username: extraInfo.username,
            email: extraInfo.email,
            firstName: extraInfo.firstName,
            lastName: extraInfo.lastName,
            phone: extraInfo.phoneNumber,
            avatar: extraInfo.avatar?.id
              ? {
                  id: extraInfo.avatar?.id.toString(),
                  url: extraInfo.avatar?.url,
                }
              : null,
            rememberMe: credentials.rememberMe === "true",
          };
        } catch (err) {
          if (err instanceof CredentialsSignin) throw err;
          throw new CredentialsSignin("Internal server error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.username = user.username;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.avatar = user.avatar;
        token.rememberMe = user.rememberMe;
        token.maxAge = user.rememberMe
          ? REMEMBER_ME_DURATION
          : DEFAULT_SESSION_DURATION;
      }

      if (trigger === "update" && token.jwt) {
        try {
          const updatedUserInfo = await getUserInfo(token.jwt as string);

          token.username = updatedUserInfo.username;
          token.firstName = updatedUserInfo.firstName;
          token.lastName = updatedUserInfo.lastName;
          token.email = updatedUserInfo.email;
          token.phone = updatedUserInfo.phoneNumber;
          token.avatar = updatedUserInfo.avatar?.id
            ? {
                id: updatedUserInfo.avatar.id.toString(),
                url: updatedUserInfo.avatar.url,
              }
            : null;
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.jwt = token.jwt as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.avatar = token.avatar as { id: string; url: string };
      }

      return session;
    },
    async authorized({ auth }) {
      return Boolean(auth);
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_DURATION,
  },
} satisfies NextAuthConfig;
