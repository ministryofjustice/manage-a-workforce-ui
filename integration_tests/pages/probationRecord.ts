import Page, { PageElement } from './page'

export default class ProbationRecordPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  probationRecordHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  button = (): PageElement => cy.get('.govuk-button')

  subHeading = (): PageElement => cy.get('h3.govuk-heading-m')

  bodyText = (): PageElement => cy.get('p.govuk-body')

  currentOrderTable = (): PageElement => cy.get('.current-order-table')
}
