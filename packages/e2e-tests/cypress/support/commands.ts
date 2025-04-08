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
  // First, let's set up a spy to log all network requests for debugging
  cy.intercept('**', (req) => {
    console.log('Network request:', req.method, req.url)
    req.continue()
  })

  // Intercept all search requests with generic patterns
  // Pattern 1: Match any POST request to a URL containing /collections/ and /search
  cy.intercept('POST', '**/collections/**/search**', (req) => {
    console.log('Intercepted collections search request:', req.url)
    req.reply({
      statusCode: 200,
      fixture: 'search-response.json'
    })
  }).as('searchRequest')
  
  // Pattern 2: Match any POST request to a URL containing /search
  cy.intercept('POST', '**/search**', (req) => {
    console.log('Intercepted generic search request:', req.url)
    req.reply({
      statusCode: 200,
      fixture: 'search-response.json'
    })
  }).as('searchRequest')
  
  // Pattern 3: Match any POST request to a URL containing /indexes/
  cy.intercept('POST', '**/indexes/**', (req) => {
    console.log('Intercepted indexes request:', req.url)
    req.reply({
      statusCode: 200,
      fixture: 'search-response.json'
    })
  }).as('searchRequest')

  // Intercept GET requests for both old and new endpoints
  cy.intercept('GET', 'https://cloud.orama.run/v1/indexes/**', {
    fixture: 'index-initialization.json',
  }).as('indexInitializationRequest')

  cy.intercept('GET', 'https://oramacore.orama.foo/**', {
    fixture: 'index-initialization.json',
  }).as('indexInitializationRequest')

  // Intercept chat requests for all possible endpoints
  cy.fixture('chat-response.json')
    .then((streamEvents) => {
      const chatResponseHandler = (req: any) => {
        console.log('Intercepted chat request:', req.url)
        const responseBody = streamEvents
          .map((event: any) => `event: ${event.event}
data: ${JSON.stringify(event.data)}

`)
          .join('')

        req.reply({
          statusCode: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
          body: responseBody
        })
      }
      
      // Intercept all chat/answer requests with generic patterns
      // Pattern 1: Match any POST request to a URL containing /collections/ and /answer
      cy.intercept('POST', '**/collections/**/answer**', chatResponseHandler).as('chatRequest')
      
      // Pattern 2: Match any POST request to a URL containing /answer
      cy.intercept('POST', '**/answer**', chatResponseHandler).as('chatRequest')
      
      // Pattern 3: Match any POST request to a URL containing /chat
      cy.intercept('POST', '**/chat**', chatResponseHandler).as('chatRequest')
      
      // Pattern 4: Match any POST request to a URL containing /stream
      cy.intercept('POST', '**/stream**', chatResponseHandler).as('chatRequest')
    })
})

// Export an empty object to make this file a module
export {}
