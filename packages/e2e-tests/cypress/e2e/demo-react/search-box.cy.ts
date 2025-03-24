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

    cy.wait('@searchRequest')

    const searchResults = cy.get('orama-search-box').shadow().find('li.sc-orama-search-results')

    searchResults.should('contain.text', 'User Segmentation').and('contain.text', 'Creating new segments')
  })

  it('should start chat after clicking on Get a summary', () => {
    cy.get('orama-search-button').click()

    const searchInput = cy.get('orama-search-box').shadow().find('input[type="search"]')
    searchInput.type('create segments')

    cy.get('orama-search-box').shadow().find('button').contains('Get a summary').click()

    cy.wait('@chatRequest')

    const oramaSources = cy.get('orama-search-box').shadow().find('orama-sources').should('exist')

    oramaSources.should('exist')
    oramaSources.shadow().find('*').should('contain.text', 'Audience management, an introduction')

    const oramaMarkdown = cy.get('orama-search-box').shadow().find('orama-markdown').should('exist')
    oramaMarkdown
      .shadow()
      .should(
        'contain.text',
        'To create a user segment, you will first need to have your index set up. Once that is done, follow these steps',
      )
  })
})
