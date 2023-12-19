import React from 'react'
import { PaymentTile } from './TableComponents'
import { ThemeProvider } from '../../theme/ThemeProvider'


const componentProps: Parameters<typeof PaymentTile>[0] = {
  cta: "Click Here",
  customer: "Joen Doe",
  subtotal: "$120.00",
  tip: "$10.00",
  onPress: () => { },
  loading: false,
  disable: false,
}

describe('<PaymentTile />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <ThemeProvider>
        <PaymentTile
          {...componentProps}
        />
      </ThemeProvider>
    )

    cy.contains(componentProps.cta)
    cy.contains(componentProps.customer)
    cy.contains(componentProps.subtotal)
  })
})