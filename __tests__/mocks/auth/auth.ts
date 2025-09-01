const NAMock = {
  auth: {
    session: {
      jwt: true,
    },
    jwt: {
      secret: process.env.AUTH_SECRET,
    },
  },
  authFn: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  handlers: {
    GET: jest.fn(),
    POST: jest.fn(),
  },
};

export const {
  authFn,
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NAMock;
