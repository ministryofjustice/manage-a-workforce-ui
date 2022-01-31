import Page from '../pages/page'
import ProbationRecordPage from '../pages/probationRecord'

context('Probation record', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Probation record header visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.probationRecordHeading().should('contain', 'Probation record')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.button().should('contain', 'Allocate')
  })

  it('Current order sub-heading visible on page with body text', () => {
    cy.task('stubGetProbationRecordNoConvictions')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.subHeading().should('contain', 'Current order')
    probationRecordPage.bodyText().should('contain', 'No current orders.')
  })

  it('Previous orders sub-heading visible on page with body text', () => {
    cy.task('stubGetProbationRecordNoConvictions')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.subHeading().should('contain', 'Previous orders')
    probationRecordPage.bodyText().should('contain', 'No previous orders.')
  })

  it('Current Order table displayed on page when active convictions exist', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage
      .currentOrderTable()
      .getTable()
      .should('deep.equal', [
        {
          Sentence: 'ORA Community Order (18 Months)',
          Offence: 'Common assault and battery - 10501',
          'Start date': '5 Nov 2020',
          'Probation practitioner': 'Faraz Haynes (PO)',
        },
        {
          Sentence: 'Adult Custody < 12m (6 Months)',
          Offence: 'Abstracting electricity - 04300',
          'Start date': '17 Nov 2019',
          'Probation practitioner': 'Sheila Linda Hancock (PSO)',
        },
      ])
  })

  it('Current Order table displays multiple offences as numbered list', () => {
    cy.task('stubGetProbationRecordMultipleOffences')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage
      .currentOrderTable()
      .getTable()
      .should('deep.equal', [
        {
          Sentence: 'Adult Custody < 12m (6 Months)',
          Offence: 'Abstracting electricity - 04300Common assault and battery - 10501',
          'Start date': '17 Nov 2019',
          'Probation practitioner': 'Sheila Linda Hancock (PSO)',
        },
      ])
  })
})
