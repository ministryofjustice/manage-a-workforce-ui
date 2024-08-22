import Page, { PageElement } from './page'

export default class AllocationCompletePage extends Page {
  constructor() {
    super('SPO Oversight Contact')
  }

  checkOnPage() {
    cy.get('h2').contains('Create an SPO Oversight contact')
  }

  continueButton = (convictionNumber): PageElement => cy.get(`#${convictionNumber}`)

  saveButton = (): PageElement => cy.get('#1')

  editButton = (): PageElement => cy.get('[value="edit"]')

  checkboxText = (): PageElement => cy.get('.govuk-checkboxes__label')

  cancelLink = (crn, convictionNumber, pduCode): PageElement =>
    cy.get(`a[href*="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner"]`).eq(1)
}
