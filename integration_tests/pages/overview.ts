import Page, { PageElement } from './page'

export default class OverviewPage extends Page {
  constructor() {
    super('Practitioner workload')
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')

  heading = (): PageElement => cy.get('h2.govuk-heading-l')

  mediumHeading = (): PageElement => cy.get('h3.govuk-heading-m')

  summaryText = (): PageElement => cy.get('.govuk-details__summary-text')

  overCapacityCard = (): PageElement => cy.get('.over-capacity')

  underCapacityCard = (): PageElement => cy.get('.under-capacity')

  cardHeading = (): PageElement => cy.get('.card__heading')

  totalCases = (): PageElement => cy.get('.card__heading > a > p')

  lastUpdated = (): PageElement => cy.get('.govuk-body-s')

  totalCasesLink = (): PageElement => cy.get('a[href*="/pdu/PDU1/TM2/OM2/active-cases"]')

  tierTable = (): PageElement => cy.get('.govuk-table')
}
