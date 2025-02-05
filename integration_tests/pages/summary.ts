import Page, { PageElement } from './page'

export default class SummaryPage extends Page {
  constructor() {
    super('Summary')
  }

  summaryHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  personalDetailsTitle = (): PageElement => cy.get('#personal-details > header > h2 ')

  sentenceTitle = (): PageElement => cy.get('#sentence > header > h2 ')

  riskTitle = (): PageElement => cy.get('#risk > header > h2 ')

  associatedDocumentsTitle = (): PageElement => cy.get('#case-details > header > h2 ')

  associatedDocumentsLink = (): PageElement => cy.get('#case-details > .app-summary-card__header > a ')

  associatedRiskLink = (): PageElement => cy.get('#risk > .app-summary-card__header > a ')

  allocateCaseButton = (convictionNumber): PageElement => cy.get(`button#${convictionNumber}`)

  riskSummaryBadge = (): PageElement => cy.get('.risk-badge')

  moreDetailHintHeader = (): PageElement => cy.get('#more-detail-hint-header')
}
