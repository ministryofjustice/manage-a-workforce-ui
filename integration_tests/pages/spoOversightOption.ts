import Page, { PageElement } from './page'

export default class OversightOptionPage extends Page {
  constructor() {
    super('SPO Oversight Contact Option')
  }

  checkOnPage() {
    cy.get('h2').contains('Save your notes as an oversight contact and allocate case to')
  }

  continueButton = (convictionNumber): PageElement => cy.get(`#${convictionNumber}`)

  checkboxText = (): PageElement => cy.get('.govuk-checkboxes__label')

  saveButton = (): PageElement => cy.get('[value="save"]')

  editButton = (): PageElement => cy.get('[value="edit"]')

  notesLink = (crn, convictionNumber, pduCode, teamCode, staffCode): PageElement =>
    cy
      .get(
        `a[href="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${teamCode}/${staffCode}/allocation-notes"]`
      )
      .eq(1)

  cancelLink = (crn, convictionNumber, pduCode): PageElement =>
    cy.get(`a[href*="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner"]`)
}
