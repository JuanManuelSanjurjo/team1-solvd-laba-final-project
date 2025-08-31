import { updateUser } from "@/lib/actions/update-user";
import { auth } from "@/auth";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/normalizers/handle-api-error", () => ({
  handleApiError: jest.fn(),
}));

describe("updateUser", () => {
  const OLD_ENV = process.env;
  const API_URL = "https://fake-api.test/api";

  const sampleData = {
    username: "newUsername",
    email: "newEmail@example.com",
    password: "newPassword123",
    passwordConfirmation: "newPassword123",
  };

  beforeAll(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: API_URL };
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { jwt: "token-123" },
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("sends PUT with correct URL, headers and body, and returns success (happy path)", async () => {
    (global.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const res = await updateUser(sampleData as any, "user-1");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOpts] = (global.fetch as jest.Mock).mock.calls[0];

    expect(calledUrl).toBe(`${API_URL}/users/user-1`);
    expect(calledOpts.method).toBe("PUT");
    expect(calledOpts.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token-123",
    });

    const parsedBody = JSON.parse(calledOpts.body as string);
    expect(parsedBody).toEqual(sampleData);

    expect(res).toEqual({
      error: false,
      message: "Success, details updated!",
    });
    expect(handleApiError).not.toHaveBeenCalled();
  });

  it("delegates to handleApiError when response.ok is false", async () => {
    (global.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const mockedError = { error: true, message: "Failed" };
    (handleApiError as jest.Mock).mockResolvedValue(mockedError);

    const res = await updateUser(sampleData as any, "user-2");

    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(Object),
      "Failed to update user"
    );
    expect(res).toBe(mockedError);
  });

  it("still sends Authorization header even if session is missing (jwt undefined)", async () => {
    (auth as jest.Mock).mockResolvedValue(undefined);
    (global.fetch as unknown as jest.Mock).mockResolvedValue({ ok: true });

    await updateUser(sampleData as any, "user-3");

    const [, calledOpts] = (global.fetch as jest.Mock).mock.calls[0];
    expect(calledOpts.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer undefined",
    });
  });
});
