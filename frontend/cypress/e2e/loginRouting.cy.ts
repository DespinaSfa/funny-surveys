describe('Login routing', () => {
  it('passes', () => {
    cy.visit('localhost:3000/')

    cy.get('a').contains('Login').click()

    cy.contains('Log in to see your polls!')
  })
})