import Page, { PageElement } from './page'

export default class AllocationConfirmPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  continueButton = (): PageElement => cy.get('.govuk-button')

  chooseDifferentProbationPractitionerLink = (crn): PageElement => cy.get(`a[href*="${crn}/allocate"]`).eq(1)
}
