import forgotPassword from "@/lib/actions/forgot-password";
import {
  TEST_API_URLS,
  HTTP_METHODS,
  TEST_EMAILS,
  ERROR_MESSAGES,
  ERROR_STATUS,
  ERROR_NAMES,
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

process.env.NEXT_PUBLIC_API_URL = TEST_API_URLS.EXAMPLE;

describe("forgotPassword Action", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockHandleApiError.mockClear();
  });

  it("returns success response on successful password reset request", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await forgotPassword({ email: TEST_EMAILS.VALID });

    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_API_URLS.EXAMPLE}/auth/forgot-password`,
      {
        method: HTTP_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: TEST_EMAILS.VALID }),
      }
    );
    expect(result).toEqual({
      error: false,
      message:
        "Success! Please check your email for password reset instructions",
    });
  });

  it("returns error response when API returns error", async () => {
    const mockErrorResponse = {
      error: true,
      message: ERROR_MESSAGES.INVALID_EMAIL,
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: {
          status: ERROR_STATUS.BAD_REQUEST,
          name: ERROR_NAMES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.INVALID_EMAIL,
          details: {},
        },
        data: {},
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await forgotPassword({ email: TEST_EMAILS.INVALID });

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to update avatar"
    );
    expect(result).toEqual(mockErrorResponse);
  });

  it("returns error response when API returns generic error", async () => {
    const mockErrorResponse = {
      error: true,
      message: "Failed to update avatar",
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: {
          status: ERROR_STATUS.INTERNAL_SERVER_ERROR,
          name: ERROR_NAMES.INTERNAL_SERVER_ERROR,
          message: "",
          details: {},
        },
        data: {},
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await forgotPassword({ email: TEST_EMAILS.VALID });

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to update avatar"
    );
    expect(result).toEqual(mockErrorResponse);
  });

  it("returns error response when response is not ok and no error object", async () => {
    const mockErrorResponse = {
      error: true,
      message: "Failed to update avatar",
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        data: { someField: "someValue" },
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await forgotPassword({ email: TEST_EMAILS.VALID });

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to update avatar"
    );
    expect(result).toEqual(mockErrorResponse);
  });

  it("handles network errors by letting them propagate", async () => {
    mockFetch.mockRejectedValue(new Error(ERROR_MESSAGES.NETWORK_ERROR));

    await expect(forgotPassword({ email: TEST_EMAILS.VALID })).rejects.toThrow(
      ERROR_MESSAGES.NETWORK_ERROR
    );
  });
});
