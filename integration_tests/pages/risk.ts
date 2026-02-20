import Page, { PageElement } from './page'

export default class RiskPage extends Page {
  constructor() {
    super('Risk')
  }

  riskHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  activeRegistrationsTable = (): PageElement => cy.get('.active-registrations-table')

  inactiveRegistrationsTable = (): PageElement => cy.get('.inactive-registrations-table')

  bodyText = (): PageElement => cy.get('.govuk-body')

  roshWidget = (): PageElement => cy.get('.rosh-widget').eq(0)

  roshDetail = (): PageElement => cy.get('.rosh-widget__table').eq(0)

  rsrWidget = (): PageElement => cy.get('.rosh-widget').eq(1)

  ogrsWidget = (): PageElement => cy.get('.rosh-widget').eq(2)

  v2Widget = (): PageElement => cy.get('.expanded-predictor-badge__dynamic')
}
