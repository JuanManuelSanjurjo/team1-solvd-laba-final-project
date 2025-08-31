import { updateAvatar } from "@/lib/actions/update-avatar";
import { deleteAvatar } from "@/lib/actions/delete-avatar";
import { auth } from "@/auth";
import { handleApiError } from "@/lib/normalizers/handle-api-error";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/actions/delete-avatar", () => ({ deleteAvatar: jest.fn() }));
jest.mock("@/lib/normalizers/handle-api-error", () => ({
  handleApiError: jest.fn(),
}));

describe("updateAvatar", () => {
  const OLD_ENV = process.env;
  const API_URL = "https://fake-api.test/api";

  beforeAll(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: API_URL };
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { jwt: "token-123", avatar: { id: "old-avatar-id" } },
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("uploads new avatar, deletes old one, and returns success payload (happy path)", async () => {
    const formData = new FormData();
    const newAvatar = [{ id: "new-id", url: "https://cdn.example/new.jpg" }];

    (global.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(newAvatar),
    });
    (deleteAvatar as jest.Mock).mockResolvedValue({
      error: false,
      message: "ok",
    });

    const res = await updateAvatar(formData);

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: "Bearer token-123" },
      body: formData,
    });

    expect(formData.get("ref")).toBe("plugin::users-permissions.user");
    expect(formData.get("field")).toBe("avatar");

    expect(deleteAvatar).toHaveBeenCalledWith("old-avatar-id");

    expect(res).toEqual({
      error: false,
      message: "Avatar updated successfully!",
      data: newAvatar[0],
    });
  });

  it("delegates to handleApiError when upload response is not ok", async () => {
    const formData = new FormData();
    (global.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    const mockedError = { error: true, message: "upload failed" };
    (handleApiError as jest.Mock).mockResolvedValue(mockedError);

    const res = await updateAvatar(formData);

    expect(handleApiError).toHaveBeenCalledWith(
      expect.any(Object),
      "Failed to update avatar"
    );
    expect(res).toBe(mockedError);
    expect(deleteAvatar).not.toHaveBeenCalled();
  });

  it("logs error when deleteAvatar reports error, but still returns success", async () => {
    const formData = new FormData();
    const newAvatar = [{ id: "new-id", url: "https://cdn.example/new.jpg" }];

    (global.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(newAvatar),
    });
    (deleteAvatar as jest.Mock).mockResolvedValue({
      error: true,
      message: "boom",
    });

    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await updateAvatar(formData);

    expect(errSpy).toHaveBeenCalledWith("Error trying to delete old avatar");
    expect(res).toEqual({
      error: false,
      message: "Avatar updated successfully!",
      data: newAvatar[0],
    });

    errSpy.mockRestore();
  });

  it("returns error result when response JSON does not include url", async () => {
    const formData = new FormData();
    const malformed = [{ id: "new-id", no_url_here: true }];

    (global.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(malformed),
    });
    (deleteAvatar as jest.Mock).mockResolvedValue({
      error: false,
      message: "ok",
    });

    const res = await updateAvatar(formData);

    expect(res).toEqual({
      error: true,
      message: "Failed to update avatar",
    });
  });
});
