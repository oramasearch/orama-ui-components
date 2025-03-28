// Define custom command types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to verify that a component is visible
       * @example cy.shouldBeVisible('.selector')
       */
      shouldBeVisible(selector: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to wait for page load
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<Window>

      /**
       * Custom command to mock Orama API responses
       * @example cy.mockOramaApi()
       */
      mockOramaApi(): void
    }
  }
}

// Custom command to verify that a component is visible
Cypress.Commands.add('shouldBeVisible', (selector: string) => {
  cy.get(selector).should('be.visible')
})

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window()
    .should('have.property', 'document')
    .and((doc: any) => doc.readyState === 'complete')
})

// Custom command to mock Orama API responses
Cypress.Commands.add('mockOramaApi', () => {
  // Intercept search requests
  cy.intercept('POST', 'https://cloud.orama.run/v1/indexes/**', {
    fixture: 'search-response.json',
  }).as('searchRequest')

  cy.intercept('GET', 'https://cloud.orama.run/v1/indexes/**', {
    fixture: 'index-initialization.json',
  }).as('indexInitializationRequest')

  cy.fixture('chat-response.json')
    .then((streamEvents) => {
      cy.intercept('POST', 'https://answer.api.orama.com/v1/answer**', (req) => {
        const responseBody = streamEvents
          .map((event: any) => `event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`)
          .join('')

        req.reply({
          statusCode: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
          body: responseBody,
        })
      })
    })
    .as('chatRequest')
})

// Export an empty object to make this file a module
export {}
