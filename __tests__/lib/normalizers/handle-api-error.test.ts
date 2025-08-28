import { handleApiError } from "@/lib/normalizers/handle-api-error";
import type { ApiResponseError } from "@/lib/normalizers/handle-api-error";

describe("handleApiError", () => {
  it("returns the error message from the API response", async () => {
    const mockJson: ApiResponseError = {
      data: null,
      error: {
        status: 400,
        name: "BadRequestError",
        message: "Invalid request",
      },
    };

    const mockResponse = {
      json: jest.fn().mockResolvedValue(mockJson),
    } as unknown as Response;

    const result = await handleApiError(mockResponse, "Default error");

    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual({
      error: true,
      message: "Invalid request",
    });
  });

  it("returns the default message when response.json throws", async () => {
    const mockResponse = {
      json: jest.fn().mockRejectedValue(new Error("Unexpected token")),
    } as unknown as Response;

    const result = await handleApiError(mockResponse, "Default error");

    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual({
      error: true,
      message: "Default error",
    });
  });

  it("prioritizes API message over default message", async () => {
    const mockJson: ApiResponseError = {
      data: null,
      error: {
        status: 500,
        name: "ServerError",
        message: "Something went wrong",
      },
    };

    const mockResponse = {
      json: jest.fn().mockResolvedValue(mockJson),
    } as unknown as Response;

    const result = await handleApiError(mockResponse, "Default error");

    expect(result.message).toBe("Something went wrong");
  });
});
