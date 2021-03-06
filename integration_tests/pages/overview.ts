import Page, { PageElement } from './page'

export default class OverviewPage extends Page {
  constructor() {
    super('John Doe')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  backLink = (): PageElement => cy.get('.govuk-back-link')

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')

  heading = (): PageElement => cy.get('h2.govuk-heading-l')

  mediumHeading = (): PageElement => cy.get('h3.govuk-heading-m')

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  summaryText = (): PageElement => cy.get('.govuk-details__summary-text')

  overCapacityCard = (): PageElement => cy.get('.over-capacity')

  underCapacityCard = (): PageElement => cy.get('.under-capacity')

  cardHeading = (): PageElement => cy.get('.card__heading')

  totalCases = (): PageElement => cy.get('.card__heading > a > p')

  lastUpdated = (): PageElement => cy.get('.govuk-body-s')

  totalCasesLink = (): PageElement => cy.get('a[href*="/J678910/convictions/123456789/allocate/OM2/active-cases"]')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  tierTable = (): PageElement => cy.get('.govuk-table')

  notificationsBadge = (): PageElement => cy.get('.moj-notification-badge')
}
