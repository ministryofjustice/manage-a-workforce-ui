import Page, { PageElement } from './page'

export default class SummaryPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  summaryHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  personalDetailsTitle = (): PageElement => cy.get('#personal-details > header > h2 ')

  sentenceTitle = (): PageElement => cy.get('#sentence > header > h2 ')

  downloadLink = (crn, convictionId, documentId): PageElement =>
    cy.get(`a[href*="/${crn}/convictions/${convictionId}/documents/${documentId}"]`)

  associatedDocumentsTitle = (): PageElement => cy.get('#case-details > header > h2 ')

  associatedDocumentsLink = (): PageElement => cy.get('#case-details > header > a ')

  allocateCaseButton = (crn, convictionId, teamCode): PageElement =>
    cy.get(`a[href*="/team/${teamCode}/${crn}/convictions/${convictionId}/choose-practitioner"]`)
}
