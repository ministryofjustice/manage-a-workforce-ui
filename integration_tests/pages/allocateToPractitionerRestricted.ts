import Page, { PageElement } from './page'

export default class AllocateToPractitionerRestrictedPage extends Page {
  constructor() {
    super('Allocate to practitioner')
  }

  restrictedStatusBadge = (): PageElement => cy.get('.govuk-body.govuk-tag--orange')

  restrictedStatusAllocationNotesHintText = (): PageElement => cy.get('#more-detail-hint')
}
