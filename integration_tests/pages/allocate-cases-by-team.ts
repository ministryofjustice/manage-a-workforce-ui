import Page, { PageElement } from './page'

export default class AllocateCasesByTeamPage extends Page {
  constructor() {
    super('North Wales')
  }

  tableCaption = (): PageElement => cy.get('.govuk-table__caption')

  link = (): PageElement => cy.get('[data-qa-link="edit-teams"]')

  tableLink = (teamCode: string): PageElement => cy.get(`[data-qa-link="${teamCode}"]`).invoke('attr', 'href')
}
