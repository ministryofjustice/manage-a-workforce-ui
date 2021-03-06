import Page, { PageElement } from './page'

export default class AllocationConfirmPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  continueButton = (): PageElement => cy.get('.govuk-button')

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  capacityImpactStatement = (): PageElement => cy.get('#impact-statement')

  redCapacities = (): PageElement => cy.get('.percentage-extra-over')

  notificationsBadge = (): PageElement => cy.get('.moj-notification-badge')
}
