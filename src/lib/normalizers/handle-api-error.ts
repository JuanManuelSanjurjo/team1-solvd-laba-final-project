export interface ApiResponseError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}

/**
 * @function
 * @param {Response} response - The response object to handle.
 * @param {string} defaultMessage - The default message to use if the response is not OK.
 * @returns {Promise<ApiResponseError>} - A promise that resolves to an object containing the result of the operation.
 *
 * @example
 * const error = await handleApiError(response, "Failed to fetch data");
 * console.log(error); // Output: { error: true, message: "Failed to fetch data" }
 */
export const handleApiError = async (
  response: Response,
  defaultMessage: string
) => {
  try {
    const json: ApiResponseError = await response.json();
    return {
      error: true,
      message: json.error.message,
    };
  } catch {
    return {
      error: true,
      message: defaultMessage,
    };
  }
};
