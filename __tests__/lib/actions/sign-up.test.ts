import signUp from "@/lib/actions/sign-up";
import {
  TEST_API_URLS,
  HTTP_METHODS,
  ERROR_MESSAGES,
  TEST_USER_DATA,
  MOCK_USER_RESPONSE,
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

describe("signUp Action", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockHandleApiError.mockClear();
  });

  const mockSuccessResponse = {
    user: MOCK_USER_RESPONSE,
  };

  it("returns success response on successful registration", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_API_URLS.EXAMPLE}/auth/local/register`,
      {
        method: HTTP_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(TEST_USER_DATA.VALID_PAYLOAD),
      }
    );

    expect(result).toEqual({
      error: false,
      message: "Success! Please confirm your account in your e-mail",
    });
  });

  it("returns error response when user object is missing from success response", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ someOtherData: "value" }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(result).toEqual({
      error: true,
      message: "Error trying to sign up!",
    });
  });

  it("returns error response when API returns error with message", async () => {
    const mockErrorResponse = {
      error: true,
      message: ERROR_MESSAGES.EMAIL_EXISTS,
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        data: null,
        error: {
          status: ERROR_STATUS.BAD_REQUEST,
          name: ERROR_NAMES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.EMAIL_EXISTS,
          details: {},
        },
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to update avatar"
    );
    expect(result).toEqual(mockErrorResponse);
  });

  it("returns error response when API returns error without message", async () => {
    const mockErrorResponse = {
      error: true,
      message: "Failed to update avatar",
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        data: null,
        error: {
          status: ERROR_STATUS.INTERNAL_SERVER_ERROR,
          name: ERROR_NAMES.INTERNAL_SERVER_ERROR,
          message: "",
          details: {},
        },
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

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

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to update avatar"
    );
    expect(result).toEqual(mockErrorResponse);
  });

  it("handles network errors by letting them propagate", async () => {
    mockFetch.mockRejectedValue(new Error(ERROR_MESSAGES.NETWORK_ERROR));

    await expect(signUp(TEST_USER_DATA.VALID_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.NETWORK_ERROR
    );
  });

  it("handles malformed JSON response", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error(ERROR_MESSAGES.INVALID_JSON)),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    await expect(signUp(TEST_USER_DATA.VALID_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.INVALID_JSON
    );
  });

  it("returns success response when user data is present", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(result).toEqual({
      error: false,
      message: "Success! Please confirm your account in your e-mail",
    });
  });

  it("returns error response for different error response structures", async () => {
    const mockErrorResponse = {
      error: true,
      message: ERROR_MESSAGES.USERNAME_TAKEN,
    };

    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: {
          status: ERROR_STATUS.UNPROCESSABLE_ENTITY,
          name: ERROR_NAMES.VALIDATION_ERROR,
          message: ERROR_MESSAGES.USERNAME_TAKEN,
          details: {
            errors: [
              {
                path: ["username"],
                message: ERROR_MESSAGES.USERNAME_TAKEN,
              },
            ],
          },
        },
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    mockHandleApiError.mockResolvedValue(mockErrorResponse);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(mockHandleApiError).toHaveBeenCalledWith(
      mockResponse,
      "Failed to update avatar"
    );
    expect(result).toEqual(mockErrorResponse);
  });
});
