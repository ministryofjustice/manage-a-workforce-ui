import Page, { PageElement } from './page'

export default class SummaryPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  summaryHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  button = (): PageElement => cy.get('.govuk-button')

  personalDetailsTitle = (): PageElement => cy.get('#personal-details > header > h2 ')

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
