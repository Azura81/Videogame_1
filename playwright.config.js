const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 75000,
  workers: 2,
  webServer: {
    command: 'npx vite --port 5178',
    port: 5178,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:5178',
    headless: true,
  },
});
