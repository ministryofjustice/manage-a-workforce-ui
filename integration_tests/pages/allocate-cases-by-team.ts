import Page, { PageElement } from './page'

export default class AllocateCasesByTeamPage extends Page {
  constructor() {
    super('North Wales')
  }

  tableCaption = (): PageElement => cy.get('.govuk-table__caption')

  link = (): PageElement => cy.get('a:contains("editing your team list")')

  unallocatedCasesLink = (teamCode: string): PageElement => cy.get(`a[href="/team/${teamCode}/cases/unallocated"]`)
}
