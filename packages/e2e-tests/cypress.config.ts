import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      const testEnv = process.env.TEST_ENV || 'react'

      switch (testEnv) {
        case 'nextjs':
          config.baseUrl = 'http://localhost:3000'
          break
        case 'vue':
          config.baseUrl = 'http://localhost:5174'
          break
        default:
          config.baseUrl = 'http://localhost:5173'
      }

      return config
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
})
