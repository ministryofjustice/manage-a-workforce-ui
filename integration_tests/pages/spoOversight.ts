import Page, { PageElement } from './page'

export default class AllocationCompletePage extends Page {
  constructor() {
    super('SPO Oversight Contact')
  }

  continueButton = (convictionNumber): PageElement => cy.get(`#${convictionNumber}`)
}
