describe('Routing and create a poll', () => {
  it('passes', () => {
    cy.visit('/')

    //go to Login page
    cy.get('a').contains('Login').click()

    cy.contains('Log in to see your polls!')

    cy.contains('label', 'Username').type('User2')
    cy.contains('label', 'Password').type('test')

    //Wrong password
    cy.get('button').contains('Submit').click()
    cy.contains('An error occurred. Please try again.')

    //enter right password
    cy.contains('label', 'Password').type('{backspace}{backspace}{backspace}{backspace}')
    cy.contains('label', 'Password').type('User2')

    //login sucessfully
    cy.get('button').contains('Submit').click()

    //dashboard
    cy.contains('About Your Polls')

    //create a poll
    cy.get('a').contains('Add Poll').click()
    cy.get('a').contains('Party').click()

    //ennter heading and description
    cy.contains('label', 'Heading').type('Geburtstagsparty Jane')
    cy.contains('label', 'Description').type('Sag mir doch wie du die Party findest und die nächste wird noch besser ;)')

    //generate poll
    cy.get('.generateButton').click()

    //logout
    cy.get('button').contains('User2').click()
    cy.contains('Logout').click()
    cy.url().should('eq', 'http://localhost:3000/login')
  })
})