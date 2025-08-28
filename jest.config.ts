import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  testMatch: [
    "<rootDir>/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/utils/",
    "<rootDir>/__tests__/mocks/",
    "<rootDir>/__tests__/helpers/",
    "<rootDir>/node_modules/",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/__tests__/utils/",
    "<rootDir>/__tests__/mocks/",
    "<rootDir>/__tests__/helpers/",
    "<rootDir>/node_modules/",
  ],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75,
    },
  },
  coverageReporters: ["text", "json-summary", "lcov"],
};

export default createJestConfig(config);
