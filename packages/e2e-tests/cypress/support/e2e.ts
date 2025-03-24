// Import commands.js using ES2015 syntax:
import './commands'

// Import Testing Library Cypress commands
import '@testing-library/cypress/add-commands'

// Prevent Cypress from failing tests when uncaught exceptions occur in the application
Cypress.on('uncaught:exception', (err: Error, runnable: Mocha.Runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})
