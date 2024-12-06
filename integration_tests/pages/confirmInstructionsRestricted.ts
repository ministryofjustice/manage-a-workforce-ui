import Page, { PageElement } from './page'

export default class InstructionsConfirmPageRestricted extends Page {
  constructor() {
    super('Review allocation notes')
  }

  restrictedStatusBadge = (): PageElement => cy.get('.govuk-body.govuk-tag--orange')

  restrictedStatusWarningTextForEmail = (): PageElement => cy.get('#not-included-warning-text')
}
