import Page, { PageElement } from './page'

export default class RiskPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  riskHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  button = (): PageElement => cy.get('.govuk-button')

  activeRegistrationsTable = (): PageElement => cy.get('.active-registrations-table')

  inactiveRegistrationsTable = (): PageElement => cy.get('.inactive-registrations-table')

  bodyText = (): PageElement => cy.get('.govuk-body')

  roshWidget = (): PageElement => cy.get('.rosh-widget').eq(0)

  rsrWidget = (): PageElement => cy.get('.rosh-widget').eq(1)

  ogrsWidget = (): PageElement => cy.get('.rosh-widget').eq(2)

  instructionsTextArea = (convictionId): PageElement => cy.get(`#instructions-${convictionId}`)

  notificationsBadge = (): PageElement => cy.get('.moj-notification-badge')
}
