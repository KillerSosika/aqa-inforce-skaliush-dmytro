const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000, 
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: 'https://automationintesting.online/', 
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    
    ignoreHTTPSErrors: true, 
    bypassCSP: true, 
    launchOptions: {
        args: [
            '--disable-web-security', 
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials'
        ]
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});