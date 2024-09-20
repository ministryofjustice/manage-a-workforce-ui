import Page, { PageElement } from './page'

export default class InstructionsConfirmPage extends Page {
  constructor() {
    super('Review allocation notes')
  }

  continueButton = (convictionNumber): PageElement => cy.get(`#${convictionNumber}`)

  label = (): PageElement => cy.get('.govuk-label')

  hint = (): PageElement => cy.get('.govuk-hint')

  copyText = (): PageElement => cy.get('#copyText')

  addRecipientHeader = (): PageElement => cy.get('.moj-add-another__title')

  emailAutocompleteItem = (): PageElement => cy.get('#person__listbox #person__option--0')

  addAnotherPersonButton = (): PageElement => cy.get('button[value*="add-another-person"]')

  lastAddAnotherPersonButton = (): PageElement => cy.get('button[value*="add-another-person"]').last()

  lastInputText = (): PageElement => cy.get('input').last()

  removeButton = (): PageElement => cy.get(`.govuk-email-list button`)

  inputTexts = (): PageElement => cy.get('input.autocomplete__input')

  hiddenInputTexts = (): PageElement => cy.get('label.govuk-recipient__label')

  cancelLink = (crn, convictionNumber, pduCode): PageElement =>
    cy.get(`a[href*="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner"]`).eq(1)

  checkboxText = (): PageElement => cy.get('.govuk-checkboxes__label')

  checkbox = (): PageElement => cy.get('#emailCopy')

  emailInput = (index): PageElement => cy.get(`input[id="person\\[${index}\\]\\[email\\]"]`)

  autoCompleteOption = (optionIndex): PageElement => cy.get(`#person__option--${optionIndex}`)

  firstAutoCompleteOption = (): PageElement => cy.get(`ul[id="person__listbox"]:first`)
}
