import Page, { PageElement } from './page'

export default class OversightOptionPageRestricted extends Page {
  constructor() {
    super('SPO Oversight Contact Option')
  }

  restrictedStatusBadge = (): PageElement => cy.get('.govuk-body.govuk-tag--orange')

  additionalLaoText = (): PageElement => cy.get('#confirmation-interrupt-lao-notes')
}
