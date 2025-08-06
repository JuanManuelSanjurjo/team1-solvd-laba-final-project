import forgotPassword from "@/actions/forgot-password";
import {
  TEST_API_URLS,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  HTTP_METHODS,
  TEST_EMAILS,
  ERROR_MESSAGES,
  ERROR_STATUS,
  ERROR_NAMES,
} from "./action-test-constants";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

process.env.API_URL = TEST_API_URLS.EXAMPLE;

describe("forgotPassword Action", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("returns true on successful password reset request", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await forgotPassword({ email: TEST_EMAILS.VALID });

    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_API_URLS.EXAMPLE}${API_ENDPOINTS.FORGOT_PASSWORD}`,
      {
        method: HTTP_METHODS.POST,
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ email: TEST_EMAILS.VALID }),
      }
    );
    expect(result).toBe(true);
  });

  it("returns false when response ok is false in success response", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: false }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const result = await forgotPassword({ email: TEST_EMAILS.VALID });

    expect(result).toBe(false);
  });

  it("throws error when API returns error with message", async () => {
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

    await expect(
      forgotPassword({ email: TEST_EMAILS.INVALID })
    ).rejects.toThrow(ERROR_MESSAGES.INVALID_EMAIL);
  });

  it("throws generic error when API returns error without message", async () => {
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

    await expect(forgotPassword({ email: TEST_EMAILS.VALID })).rejects.toThrow(
      ERROR_MESSAGES.RESET_PASSWORD
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

    await expect(forgotPassword({ email: TEST_EMAILS.VALID })).rejects.toThrow(
      ERROR_MESSAGES.RESET_PASSWORD
    );
  });

  it("handles network errors", async () => {
    mockFetch.mockRejectedValue(new Error(ERROR_MESSAGES.NETWORK_ERROR));

    await expect(forgotPassword({ email: TEST_EMAILS.VALID })).rejects.toThrow(
      ERROR_MESSAGES.NETWORK_ERROR
    );
  });

  it("handles malformed JSON response", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error(ERROR_MESSAGES.INVALID_JSON)),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    await expect(forgotPassword({ email: TEST_EMAILS.VALID })).rejects.toThrow(
      ERROR_MESSAGES.INVALID_JSON
    );
  });
});
