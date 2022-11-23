import Page, { PageElement } from './page'

export default class InstructionsConfirmPage extends Page {
  constructor() {
    super('Review allocation instructions')
  }

  continueButton = (convictionId): PageElement => cy.get(`#${convictionId}`)

  label = (): PageElement => cy.get('.govuk-label')

  hint = (): PageElement => cy.get('.govuk-hint')

  copyText = (): PageElement => cy.get('#copyText')

  addRecipientHeader = (): PageElement => cy.get('.moj-add-another__title')

  addAnotherPersonButton = (): PageElement => cy.get('.moj-add-another__add-button')

  inputTexts = (): PageElement => cy.get('input.govuk-input')

  cancelLink = (crn, convictionId, teamCode): PageElement =>
    cy.get(`a[href*="/team/${teamCode}/${crn}/convictions/${convictionId}/choose-practitioner"]`).eq(1)

  checkboxText = (): PageElement => cy.get('.govuk-checkboxes__label')

  checkbox = (): PageElement => cy.get('#emailCopy')

  emailInput = (index): PageElement => cy.get(`#person\\[${index}\\]\\[email\\]`)
}
