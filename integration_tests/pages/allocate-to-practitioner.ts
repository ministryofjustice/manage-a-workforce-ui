import Page, { PageElement } from './page'

export default class AllocateToPractitionerPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  continueButton = (): PageElement => cy.get('.govuk-button')

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  capacityImpactStatement = (): PageElement => cy.get('#impact-statement')

  redCapacities = (): PageElement => cy.get('.percentage-extra-over')
}
