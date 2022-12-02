import Page, { PageElement } from './page'

export default class ProbationRecordPage extends Page {
  constructor() {
    super('Probation record')
  }

  probationRecordHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  subHeading = (): PageElement => cy.get('h3.govuk-heading-m')

  bodyText = (): PageElement => cy.get('p.govuk-body')

  currentOrderTable = (): PageElement => cy.get('.current-order-table')

  previousOrderTable = (): PageElement => cy.get('.previous-order-table')

  viewAllLink = (): PageElement => cy.get('a[href*="/team/TM1/J678910/convictions/1/probation-record?viewAll=true"]')
}
