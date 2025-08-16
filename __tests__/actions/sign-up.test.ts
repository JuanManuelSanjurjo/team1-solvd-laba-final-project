import signUp from "@/actions/sign-up";
import {
  TEST_API_URLS,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  HTTP_METHODS,
  TEST_EMAILS,
  ERROR_MESSAGES,
  TEST_USER_DATA,
  MOCK_USER_RESPONSE,
  ERROR_STATUS,
  ERROR_NAMES,
} from "./action-test-constants";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

process.env.NEXT_PUBLIC_API_URL = TEST_API_URLS.EXAMPLE;

describe("signUp Action", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const mockSuccessResponse = {
    user: MOCK_USER_RESPONSE,
  };

  it("returns user data on successful registration", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_API_URLS.EXAMPLE}${API_ENDPOINTS.REGISTER}`,
      {
        method: HTTP_METHODS.POST,
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(TEST_USER_DATA.VALID_PAYLOAD),
      }
    );

    expect(result).toEqual({
      id: 1,
      username: "testuser",
      email: TEST_EMAILS.VALID,
    });
  });

  it("returns false when user object is missing from success response", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ someOtherData: "value" }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    expect(result).toBe(false);
  });

  it("throws error when API returns error with message", async () => {
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

    await expect(signUp(TEST_USER_DATA.VALID_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.EMAIL_EXISTS
    );
  });

  it("throws generic error when API returns error without message", async () => {
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

    await expect(signUp(TEST_USER_DATA.VALID_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.SIGN_UP
    );
  });

  it("throws generic error when response is not ok and no error object", async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        data: { someField: "someValue" },
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    await expect(signUp(TEST_USER_DATA.VALID_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.SIGN_UP
    );
  });

  it("handles network errors", async () => {
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

  it("correctly excludes password from returned user data", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await signUp(TEST_USER_DATA.VALID_PAYLOAD);

    // Ensure password is not in the returned data
    expect(result).not.toHaveProperty("password");
    expect(result).toEqual({
      id: 1,
      username: "testuser",
      email: TEST_EMAILS.VALID,
    });
  });

  it("handles different error response structures", async () => {
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

    await expect(signUp(TEST_USER_DATA.VALID_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.USERNAME_TAKEN
    );
  });
});
