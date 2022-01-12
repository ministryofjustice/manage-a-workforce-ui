import Page, { PageElement } from './page'

export default class CaseViewPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  personalDetailsTitle = (): PageElement => cy.get('#personal-details > header > h2 ')
}
