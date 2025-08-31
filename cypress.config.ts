import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 80000,
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
