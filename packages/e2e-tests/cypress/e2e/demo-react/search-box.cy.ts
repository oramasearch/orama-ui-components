describe('SearchBox Component', () => {
  beforeEach(() => {
    cy.mockOramaApi()
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should type in search input', () => {
    cy.get('orama-search-button').click()

    const searchInput = cy.get('orama-search-box').shadow().find('input[type="search"]')

    searchInput.type('test query')
    searchInput.should('have.value', 'test query')

    searchInput.clear()
    searchInput.should('have.value', '')
  })

  it('should close search modal when clicking outside', () => {
    cy.get('orama-search-button').click()

    const dialog = cy.get('orama-search-box').shadow().find('dialog')
    dialog.should('exist').and('be.visible').and('have.class', 'open')

    dialog.click({ force: true })

    dialog.should('not.exist')
  })

  it('should display suggestions when provided', () => {
    cy.get('orama-search-button').click()
    const suggestionsList = cy.get('orama-search-box').shadow().find('.suggestions-list').should('exist')

    suggestionsList.find('li.suggestion-item-list').should('have.length', 3)
  })

  it('should have expected results', () => {
    cy.get('orama-search-button').click()

    const searchInput = cy.get('orama-search-box').shadow().find('input[type="search"]')
    searchInput.type('create segments')
    
    // Wait for the search request to be intercepted
    cy.wait('@searchRequest', { timeout: 10000 })

    // Check for search results
    const searchResults = cy.get('orama-search-box').shadow().find('li.sc-orama-search-results')
    searchResults.should('exist')

    searchResults.should('satisfy', ($el) => {
      const text = $el.text()
      return text.includes('User Segmentation') || text.includes('Creating new segments')
    })
  })

  it('should start chat after clicking on Get a summary', () => {
    // Open the search box
    cy.get('orama-search-button').click()

    // Find the input element and type the search query
    const searchInput = cy.get('orama-search-box').shadow().find('input[type="search"]')
    searchInput.type('create segments')
    
    // Wait for the search request to be intercepted
    cy.wait('@searchRequest', { timeout: 10000 })
    
    // Wait for search results to be visible
    cy.get('orama-search-box').shadow().find('li.sc-orama-search-results').should('exist')
    
    // Log all buttons to help with debugging
    cy.get('orama-search-box').shadow().find('button').then(buttons => {
      console.log(`Found ${buttons.length} buttons`)
      buttons.each((i, el) => {
        console.log(`Button ${i} text: ${Cypress.$(el).text()}`)
      })
    })
    
    // Use cy.contains to find the button with 'summary' text (case insensitive)
    cy.get('orama-search-box')
      .shadow()
      .contains('button', /summary/i, { timeout: 10000 })
      .click({ force: true })
    
    // Wait for the chat request to be intercepted
    cy.wait('@chatRequest', { timeout: 20000 })
    
    // Check for chat response
    cy.get('orama-search-box')
      .shadow()
      .find('.chat-container, .chat-response, [class*=chat]')
      .should('exist')
  })
})
