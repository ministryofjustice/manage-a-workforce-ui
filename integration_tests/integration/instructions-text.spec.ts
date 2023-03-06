import DocumentsPage from '../pages/documents'
import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ProbationRecordPage from '../pages/probationRecord'
import RiskPage from '../pages/risk'

const FOUR_WEEKS_AND_A_DAY_IN_MS = (4 * 7 + 1) * 24 * 3600 * 1000

context('Instructions text', () => {
  beforeEach(() => {
    cy.task('stubSetup')
  })

  it('Instructions text should save and display when switching to summary page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.instructionsTextArea().should('exist')
    riskPage.instructionsTextArea().clear()
    riskPage.instructionsTextArea().type('Test Summary')
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('have.value', 'Test Summary')
  })

  it('Instructions text should save and display when switching to probation record page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().clear()
    summaryPage.instructionsTextArea().type('Test Probation Record')
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.instructionsTextArea().should('have.value', 'Test Probation Record')
  })

  it('Instructions text should save and display when switching to risk page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().clear()
    summaryPage.instructionsTextArea().type('Test Risk')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.instructionsTextArea().should('have.value', 'Test Risk')
  })

  it('Instructions text should save and display when switching to documents page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().clear()
    summaryPage.instructionsTextArea().type('Test Documents')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetDocuments')
    cy.visit('/pdu/PDU1/J678910/convictions/1/documents')
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.instructionsTextArea().should('have.value', 'Test Documents')
  })

  it('Instructions text should be removed after TTL expired', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.clock()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().clear()
    summaryPage.instructionsTextArea().type('Test Documents')
    // Visit random non-instructions page to save instructions
    cy.task('stubGetAllRegions')
    cy.visit('/regions')
    cy.task('stubGetCurrentlyManagedCaseOverview', '1')
    cy.task('stubGetDocuments')
    // Must reset clock befoe changing the time
    cy.clock().then(clock => {
      clock.restore()
    })
    cy.clock(FOUR_WEEKS_AND_A_DAY_IN_MS)
    cy.visit('/pdu/PDU1/J678910/convictions/1/documents').then(_ => {
      // eslint-disable-next-line no-unused-expressions
      expect(localStorage.getItem('instructions-save-J678910-1')).to.be.null
    })
    const documentsPageReload = Page.verifyOnPage(DocumentsPage)
    documentsPageReload.instructionsTextArea().should('have.value', '')
  })
})
