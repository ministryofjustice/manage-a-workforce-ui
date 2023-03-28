import Page, { PageElement } from './page'

export default class DecisionEvidencingPage extends Page {
  constructor() {
    super('Evidence your decision')
  }

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  breadCrumbsSection = (): PageElement => cy.get('.govuk-breadcrumbs__list')
}
