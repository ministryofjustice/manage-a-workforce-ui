import Page, { PageElement } from './page'

export default class AllocateCasesByTeamPage extends Page {
  constructor() {
    super('Allocate cases by team')
  }

  tableCaption = (): PageElement => cy.get('.govuk-table__caption')

  editTeamsLink = (): PageElement => cy.get('[data-qa-link="edit-teams"]')

  findUnallocatedLink = (): PageElement => cy.get('a[href="/pdu/PDU1/find-unallocated"]')

  tableLink = (teamCode: string): PageElement => cy.get(`[data-qa-link="${teamCode}"]`).invoke('attr', 'href')

  footer = (): PageElement => cy.get('.probation-common-fallback-footer')

  feedbackYes = (): PageElement => cy.get('#feedbackYes')

  feedbackNo = (): PageElement => cy.get('#feedbackNo')
}
