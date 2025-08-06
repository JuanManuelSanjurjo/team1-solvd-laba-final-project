import resetPassword from "@/actions/reset-password";
import {
  TEST_API_URLS,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  HTTP_METHODS,
  TEST_EMAILS,
  ERROR_MESSAGES,
  TEST_USER_DATA,
  MOCK_JWT_TOKEN,
} from "./action-test-constants";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

process.env.API_URL = TEST_API_URLS.STRAPI;

describe("resetPassword", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should reset password successfully", async () => {
    const mockResponse = {
      jwt: MOCK_JWT_TOKEN,
      user: {
        id: 1,
        username: "testuser",
        email: TEST_EMAILS.VALID,
        provider: "local",
        confirmed: true,
        blocked: false,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await resetPassword(TEST_USER_DATA.RESET_PAYLOAD);

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_API_URLS.STRAPI}${API_ENDPOINTS.RESET_PASSWORD}`,
      {
        method: HTTP_METHODS.POST,
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(TEST_USER_DATA.RESET_PAYLOAD),
      }
    );
  });

  it("should throw error on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: ERROR_MESSAGES.INVALID_RESET_CODE,
        },
      }),
    } as Response);

    await expect(
      resetPassword({
        ...TEST_USER_DATA.RESET_PAYLOAD,
        code: TEST_USER_DATA.INVALID_CODE,
      })
    ).rejects.toThrow(ERROR_MESSAGES.INVALID_RESET_CODE);
  });

  it("should throw error on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error(ERROR_MESSAGES.NETWORK_ERROR));

    await expect(resetPassword(TEST_USER_DATA.RESET_PAYLOAD)).rejects.toThrow(
      ERROR_MESSAGES.NETWORK_ERROR
    );
  });

  it("should return false when response is missing jwt or user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    const result = await resetPassword(TEST_USER_DATA.RESET_PAYLOAD);

    expect(result).toBe(false);
  });
});
