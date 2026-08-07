import Page, { PageElement } from './page'

export default class AllocateToPractitionerPage extends Page {
  constructor() {
    super('Allocate to practitioner')
  }

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  breadCrumbsSection = (): PageElement => cy.get('.govuk-breadcrumbs__list')

  provisionalTierTag = (): PageElement => cy.get('.govuk-body.govuk-tag--orange')
}
