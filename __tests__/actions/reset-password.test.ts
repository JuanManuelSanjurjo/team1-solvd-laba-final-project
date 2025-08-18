import resetPassword from "@/actions/reset-password";
import {
  TEST_API_URLS,
  HTTP_METHODS,
  ERROR_MESSAGES,
  TEST_USER_DATA,
} from "./action-test-constants";

jest.mock("@/lib/normalizers/handle-api-error", () => ({
  handleApiError: jest.fn(),
}));

import { handleApiError } from "@/lib/normalizers/handle-api-error";
const mockHandleApiError = handleApiError as jest.MockedFunction<
  typeof handleApiError
>;

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

process.env.NEXT_PUBLIC_API_URL = TEST_API_URLS.STRAPI;

describe("resetPassword", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockHandleApiError.mockClear();
  });

  it("should reset password successfully", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await resetPassword(TEST_USER_DATA.RESET_PAYLOAD);

    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_API_URLS.STRAPI}/auth/reset-password`,
      {
        method: HTTP_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(TEST_USER_DATA.RESET_PAYLOAD),
      }
    );
    expect(result).toEqual({
      error: false,
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  });

  it("should return error response on API error", async () => {
    const mockErrorResponse = {
      error: true,
      message: ERROR_MESSAGES.INVALID_RESET_CODE,
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: {
          message: ERROR_MESSAGES.INVALID_RESET_CODE,
        },
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await resetPassword({
      ...TEST_USER_DATA.RESET_PAYLOAD,
      code: TEST_USER_DATA.INVALID_CODE,
    });

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to reset password"
    );
    expect(result).toEqual(mockErrorResponse);
  });

  it("should handle network errors by letting them propagate", async () => {
    mockFetch.mockRejectedValue(new Error(ERROR_MESSAGES.NETWORK_ERROR));

    await expect(resetPassword(TEST_USER_DATA.RESET_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.NETWORK_ERROR
    );
  });

  it("should return error response when API returns generic error", async () => {
    const mockErrorResponse = {
      error: true,
      message: "Failed to reset password",
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await resetPassword(TEST_USER_DATA.RESET_PAYLOAD);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to reset password"
    );
    expect(result).toEqual(mockErrorResponse);
  });
});
