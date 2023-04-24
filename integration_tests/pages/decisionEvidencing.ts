import Page, { PageElement } from './page'

export default class DecisionEvidencingPage extends Page {
  constructor() {
    super('Explain your decision')
  }

  link = (): PageElement => cy.get('.govuk-button-group .govuk-link')

  breadCrumbsSection = (): PageElement => cy.get('.govuk-breadcrumbs__list')

  evidenceText = (): PageElement => cy.get('#evidenceText')

  radioButton = (value): PageElement => cy.get(`input[name='isSensitive'][value='${value}']`)
}
