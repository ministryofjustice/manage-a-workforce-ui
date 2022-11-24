import Page, { PageElement } from './page'

export default class AllocateToPractitionerPage extends Page {
  constructor() {
    super('Allocate to practitioner')
  }

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  capacityImpactStatement = (): PageElement => cy.get('#impact-statement')

  redCapacities = (): PageElement => cy.get('.percentage-extra-over')
}
