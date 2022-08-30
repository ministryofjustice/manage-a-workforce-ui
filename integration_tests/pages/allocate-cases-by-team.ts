import Page, { PageElement } from './page'

export default class AllocateCasesByTeamPage extends Page {
  constructor() {
    super('North Wales')
  }

  tableCaption = (): PageElement => cy.get('.govuk-table__caption')
}
