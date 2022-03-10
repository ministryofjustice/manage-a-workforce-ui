import Page, { PageElement } from './page'

export default class OverviewPage extends Page {
  constructor() {
    super('John Doe')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')

  heading = (): PageElement => cy.get('h2.govuk-heading-l')

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  summaryText = (): PageElement => cy.get('.govuk-details__summary-text')

  overCapacityCard = (): PageElement => cy.get('.over-capacity')

  underCapacityCard = (): PageElement => cy.get('.under-capacity')

  cardHeading = (): PageElement => cy.get('.card__heading')
}
