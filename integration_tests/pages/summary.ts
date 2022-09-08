import Page, { PageElement } from './page'

export default class SummaryPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  summaryHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  button = (): PageElement => cy.get('.govuk-button')

  personalDetailsTitle = (): PageElement => cy.get('#personal-details > header > h2 ')

  sentenceTitle = (): PageElement => cy.get('#sentence > header > h2 ')

  downloadLink = (crn, convictionId, documentId): PageElement =>
    cy.get(`a[href*="/${crn}/convictions/${convictionId}/documents/${documentId}"]`)

  caseDetailsTitle = (): PageElement => cy.get('#case-details > header > h2 ')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  allocateCaseButton = (crn, convictionId, teamCode): PageElement =>
    cy.get(`a[href*="/team/${teamCode}/${crn}/convictions/${convictionId}/allocate"]`)

  instructionsTextArea = (): PageElement => cy.get(`#instructions`)
}
