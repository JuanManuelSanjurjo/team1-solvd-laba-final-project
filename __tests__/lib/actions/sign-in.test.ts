import signInAction from "@/lib/actions/sign-in";
import { signIn } from "@/auth";

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}));

describe("signInAction", () => {
  const data = {
    email: "user@example.com",
    password: "secret",
    rememberMe: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signIn with credentials provider and returns success message", async () => {
    (signIn as jest.Mock).mockResolvedValue(undefined);

    const res = await signInAction(data);

    expect(signIn).toHaveBeenCalledWith("credentials", {
      identifier: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      redirect: false,
    });
    expect(res).toEqual({
      error: false,
      message: "Login successful! Redirecting...",
    });
  });

  it("returns cleaned error message when signIn throws an Error", async () => {
    (signIn as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials. Read more at https://example.com/docs")
    );

    const res = await signInAction(data);

    expect(res).toEqual({
      error: true,
      message: "Invalid credentials.",
    });
  });

  it("returns generic message when signIn throws a non-Error value", async () => {
    (signIn as jest.Mock).mockRejectedValue("boom");
    const res = await signInAction(data);

    expect(res).toEqual({
      error: true,
      message: "An unknown error occurred",
    });
  });
});
