import Page from '../pages/page'
import SelectTeamsPage from '../pages/teams'
import BeforeYouStartPage from '../pages/beforeYouStart'

context('Select teams', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/pdu/PDU1/select-teams')
  })

  it('Caption text visible on page', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.captionText().should('contain', 'A Region')
  })

  it('Legend heading visible on page', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })

  it('hint visible on page', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage
      .hint()
      .should(
        'contain',
        'Select all the teams you currently allocate cases to. This includes teams you manage and teams you allocate to when on duty.'
      )
      .and('contain', 'You can select more than one team.')
  })

  it('teams in alphabetical order', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage
      .checkboxes()
      .getCheckBoxes()
      .should('deep.equal', [
        {
          inputValue: 'TM1',
          labelValue: 'A Team',
        },
        {
          inputValue: 'TM2',
          labelValue: 'B Team',
        },
        {
          inputValue: 'TM3',
          labelValue: 'C Team',
        },
        {
          inputValue: 'TM4',
          labelValue: 'D Team',
        },
      ])
  })

  it('continue button exists', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.button().trimTextContent().should('equal', 'Continue')
  })

  it('selecting no teams and continuing causes error', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.button().click()
    selectTeamsPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select the teams you allocate to')
  })

  it('selecting cancel link goes to before you start screen', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.cancelLink().click()
    Page.verifyOnPage(BeforeYouStartPage)
  })
})
