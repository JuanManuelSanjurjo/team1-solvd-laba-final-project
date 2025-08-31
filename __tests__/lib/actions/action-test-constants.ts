export const TEST_API_URLS = {
  EXAMPLE: "https://api.example.com",
  STRAPI: "https://shoes-shop-strapi.herokuapp.com/api",
} as const;

export const API_ENDPOINTS = {
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  REGISTER: "/auth/local/register",
} as const;

export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: "application/json",
} as const;

export const DEFAULT_HEADERS = {
  "Content-Type": HTTP_HEADERS.CONTENT_TYPE_JSON,
} as const;

export const HTTP_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export const TEST_EMAILS = {
  VALID: "test@example.com",
  INVALID: "invalid-email",
} as const;

export const ERROR_MESSAGES = {
  RESET_PASSWORD: "Error trying to reset password!",
  SIGN_UP: "Error trying to sign up!",
  NETWORK_ERROR: "Network error",
  INVALID_JSON: "Invalid JSON",
  INVALID_EMAIL: "Invalid email address",
  EMAIL_EXISTS: "Email already exists",
  USERNAME_TAKEN: "Username already taken",
  INVALID_RESET_CODE: "Invalid reset code",
} as const;

export const TEST_USER_DATA = {
  VALID_PAYLOAD: {
    username: "testuser",
    email: TEST_EMAILS.VALID,
    password: "password123",
  },
  RESET_PAYLOAD: {
    password: "newPassword123",
    passwordConfirmation: "newPassword123",
    code: "reset-code-123",
  },
  INVALID_CODE: "invalid-code",
  RESET_CODE: "reset-code-123",
} as const;

export const MOCK_USER_RESPONSE = {
  id: 1,
  username: "testuser",
  email: TEST_EMAILS.VALID,
  provider: "local",
  confirmed: false,
  blocked: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  phoneNumber: null,
  firstName: null,
  lastName: null,
  customerId: null,
} as const;

export const MOCK_JWT_TOKEN = "test-jwt-token";

export const ERROR_STATUS = {
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_NAMES = {
  VALIDATION_ERROR: "ValidationError",
  INTERNAL_SERVER_ERROR: "InternalServerError",
} as const;
