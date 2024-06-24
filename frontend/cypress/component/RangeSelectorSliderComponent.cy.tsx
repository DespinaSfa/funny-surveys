import React from 'react'
import SliderComponent from '../../src/Components/RangeSelector'

describe('<SliderComponent />', () => {
  it('renders', () => {
    
    const onChangeSpy = cy.spy().as('onChangeSpy')

    cy.mount(<SliderComponent min={0} max={5} step={1} onChange={onChangeSpy} />)

    //checked ob default mäßig die Mitte ausgewählt ist
    cy.get('span').contains(3)
    cy.get('input').should('have.attr', 'value', '3')

    //checked ob die richtige Anzahl an Steps vorhanden sind
    cy.get('[data-index="0"]').should('have.length', 3)
    cy.get('[data-index="1"]').should('have.length', 1)
    cy.get('[data-index="2"]').should('have.length', 1)
    cy.get('[data-index="3"]').should('have.length', 1)
    cy.get('[data-index="4"]').should('have.length', 1)
    cy.get('[data-index="5"]').should('have.length', 1)

    //change slider to 4 -> TODO: funktioniert nur getrixt
    cy.get('span input[type=range]').click({multiple: true, force: true})
    cy.get('span input[type=range]').type('{rightArrow}{rightArrow}')
    cy.get('span .MuiSlider-thumb').invoke('attr', 'style', 'left: 80%')
    cy.get('span .MuiSlider-track').invoke('attr', 'style', 'width: 80%')
  })
})