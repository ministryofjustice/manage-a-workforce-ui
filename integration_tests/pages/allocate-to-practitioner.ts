import Page, { PageElement } from './page'

export default class AllocateToPractitionerPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  capacityImpactStatement = (): PageElement => cy.get('#impact-statement')

  redCapacities = (): PageElement => cy.get('.percentage-extra-over')
}
