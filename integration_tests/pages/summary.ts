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

  associatedDocumentsLink = (): PageElement => cy.get('#case-details > header > a ')

  allocateCaseButton = (crn, convictionNumber, pduCode): PageElement =>
    cy.get(`a[href*="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner"]`)

  riskSummaryBadge = (): PageElement => cy.get('.risk-badge')
}
