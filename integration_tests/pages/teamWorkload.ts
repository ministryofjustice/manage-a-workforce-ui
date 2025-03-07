import Page, { PageElement } from './page'

export default class TeamWorkloadPage extends Page {
  constructor() {
    super('Team Workload')
  }

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')

  heading = (): PageElement => cy.get('h1.govuk-heading-xl')

  mediumHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  totalCases = (): PageElement => cy.get('.card.card-total')

  averageWorkload = (): PageElement => cy.get('.card.card-total-subset')

  teamTableRows = (): PageElement => cy.get('.govuk-table tbody tr')
}
