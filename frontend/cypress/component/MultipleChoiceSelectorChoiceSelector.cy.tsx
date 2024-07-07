import React from 'react'
import ChoiceSelector from '../../src/Components/MultipleChoiceSelector'

describe('<ChoiceSelector />', () => {
  it('renders', () => {

    const onChangeSpy = cy.spy().as('onChangeSpy')

    cy.mount(<ChoiceSelector options={['Option A', 'Option B', 'Option C', 'Option D']} onChange={onChangeSpy} />)

    //checked ob richtige Optionen gerendert werden
    cy.contains('Option A')
    cy.contains('Option B')
    cy.contains('Option C')
    cy.contains('Option D')

    //überprüft ob default mäßig eine Option gechecked ist
    cy.get('input[checked]')

    //checked last checkbos
    cy.get('[type="checkbox"]').last().check()
    cy.get('[type="checkbox"]').last().should('be.checked')

    //checked 3rd checkbos
    cy.get('[type="checkbox"]').eq(2).check()
    cy.get('[type="checkbox"]').eq(2).should('be.checked')

    //checked 2nd checkbos
    cy.get('[type="checkbox"]').eq(1).check()
    cy.get('[type="checkbox"]').eq(1).should('be.checked')

    //checked first checkbos
    cy.get('[type="checkbox"]').first().check()
    cy.get('[type="checkbox"]').first().should('be.checked')

    //checked Option B
    cy.contains('Option B').click()
    cy.get('[type="checkbox"]').eq(1).should('be.checked')

    //checked Option C
    cy.contains('Option C').click()
    cy.get('[type="checkbox"]').eq(2).should('be.checked')

    //checked Option D
    cy.contains('Option D').click()
    cy.get('[type="checkbox"]').last().should('be.checked')

    //checked Option A
    cy.contains('Option A').click()
    cy.get('[type="checkbox"]').first().should('be.checked')
  })
})