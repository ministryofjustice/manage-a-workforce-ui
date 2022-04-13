import Page, { PageElement } from './page'

export default class InstructionsConfirmPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  continueButton = (): PageElement => cy.get('.govuk-button')

  instructionsTextArea = (convictionId): PageElement => cy.get(`#instructions-${convictionId}`)

  label = (): PageElement => cy.get('.govuk-label')

  hint = (): PageElement => cy.get('.govuk-hint')

  insetText = (): PageElement => cy.get('.govuk-inset-text p')

  cancelLink = (crn, convictionId): PageElement =>
    cy.get(`a[href*="${crn}/convictions/${convictionId}/allocate"]`).eq(1)
}
