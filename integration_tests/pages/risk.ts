import Page, { PageElement } from './page'

export default class RiskPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  riskHeading = (): PageElement => cy.get('h2.govuk-heading-l')
}
