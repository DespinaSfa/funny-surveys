import React, { useState } from 'react'
import DropdownMenu from '../../src/Components/UserHandler/UserHandler'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

describe('<DropdownMenu />', () => {
  it('renders', () => {

    const onChangeSpy = cy.spy().as('onChangeSpy')
    
    const menuItems = [
      { label: 'Dashboard', action: onChangeSpy, disabled: false},
      { label: 'Change Username', action: onChangeSpy, disabled: false},
      { label: 'Logout', action: onChangeSpy, disabled: false },
    ];

    //test click
    cy.mount(<DropdownMenu text={'Username'} icon={<KeyboardArrowDownIcon />} menuItems={menuItems} openDialog={false} setOpenDialog={onChangeSpy} />)

    cy.get('[data-testid="KeyboardArrowDownIcon"]')

    cy.contains('Username').click()

    cy.contains('Dashboard').click()
    cy.contains('Username').click()
    cy.contains('Change Username').click()
    cy.contains('Username').click()
    cy.contains('Logout').click()

    //test open dialog
    cy.mount(<DropdownMenu text={'Username'} icon={<KeyboardArrowDownIcon />} menuItems={menuItems} openDialog={true} setOpenDialog={onChangeSpy} />)
    cy.contains('Update Username')
    cy.get('.MuiInputBase-input').click().type('User3')
    cy.get('button').contains('Cancel')
    cy.get('button').contains('Save').click()

    const menuItems2 = [
      { label: 'Dashboard', action: onChangeSpy, disabled: true},
      { label: 'Change Username', action: onChangeSpy, disabled: false},
      { label: 'Logout', action: onChangeSpy, disabled: false },
    ];

    //test disabled
    cy.mount(<DropdownMenu text={'Username'} icon={<KeyboardArrowDownIcon />} menuItems={menuItems2} openDialog={false} setOpenDialog={onChangeSpy} />)
    cy.contains('Username').click()

    cy.get('[aria-disabled="true"]')
    cy.contains('Change Username').click()
    cy.contains('Username').click()
    cy.contains('Logout').click()
  })
})
