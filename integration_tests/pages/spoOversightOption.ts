import Page, { PageElement } from './page'

export default class OversightOptionPage extends Page {
  constructor() {
    super('SPO Oversight Contact Option')
  }

  continueButton = (convictionNumber): PageElement => cy.get(`#${convictionNumber}`)

  checkboxText = (): PageElement => cy.get('.govuk-checkboxes__label')

  cancelLink = (crn, convictionNumber, pduCode): PageElement =>
    cy.get(`a[href*="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner"]`).eq(1)
}
