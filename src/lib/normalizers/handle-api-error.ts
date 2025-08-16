export interface ApiResponseError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}

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
