const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 75000,
  workers: 2,
  webServer: {
    command: 'npx vite --port 5174',
    port: 5174,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
  },
});
