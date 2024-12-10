import Page, { PageElement } from './page'

export default class SummaryRestrictedPage extends Page {
  constructor() {
    super('Summary')
  }

  restrictedStatusBadge = (): PageElement => cy.get('.govuk-body.govuk-tag--orange')

  restrictedStatusAllocationNotesHintText = (): PageElement => cy.get('#more-detail-hint')
}
