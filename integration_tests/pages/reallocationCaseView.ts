import Page, { PageElement } from './page'

export default class ReallocationCaseViewPage extends Page {
  constructor() {
    super('Summary')
  }

  popHeader = (): PageElement => cy.get('#pop-header')

  appSummaryCard = (): PageElement => cy.get('.app-summary-card')
}
