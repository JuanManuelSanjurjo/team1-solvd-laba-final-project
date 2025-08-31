import type { DeleteAvatarResponse } from "@lib/actions/delete-avatar";
import { deleteAvatar } from "@lib/actions/delete-avatar";
import { auth } from "@/auth";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/lib/normalizers/handle-api-error", () => ({
  handleApiError: jest.fn(),
}));

describe("deleteAvatar", () => {
  const OLD_ENV = process.env;
  const API_URL = "https://api.example.test";

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: API_URL };
    (auth as jest.Mock).mockResolvedValue({
      user: { jwt: "test-jwt-token" },
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns undefined when avatarId is null", async () => {
    const out = await deleteAvatar(null);
    expect(out).toBeUndefined();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("calls fetch with correct URL, method and Authorization header", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const avatarId = "12345";
    const res = (await deleteAvatar(avatarId)) as DeleteAvatarResponse;
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/upload/files/${avatarId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer test-jwt-token",
        },
      }
    );

    expect(res).toEqual({ error: false, message: "Avatar deleted" });
    expect(handleApiError).not.toHaveBeenCalled();
  });

  it("delegates to handleApiError when response.ok is false", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    const mockedError: DeleteAvatarResponse = {
      error: true,
      message: "something failed",
    };
    (handleApiError as jest.Mock).mockResolvedValue(mockedError);

    const avatarId = "bad-id";
    const out = (await deleteAvatar(avatarId)) as DeleteAvatarResponse;

    expect(handleApiError).toHaveBeenCalledTimes(1);
    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(Object),
      "Failed to update avatar"
    );
    expect(out).toEqual(mockedError);
  });

  it("still sends Authorization header even if session is missing (jwt undefined)", async () => {
    (auth as jest.Mock).mockResolvedValue(undefined);
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const avatarId = "999";
    await deleteAvatar(avatarId);

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/upload/files/${avatarId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer undefined",
        },
      }
    );
  });
});
