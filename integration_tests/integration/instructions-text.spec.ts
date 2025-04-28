import DocumentsPage from '../pages/documents'
import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ProbationRecordPage from '../pages/probationRecord'
import RiskPage from '../pages/risk'
import InstructionsConfirmPage from '../pages/confirmInstructions'

const FOUR_WEEKS_AND_A_DAY_IN_MS = (4 * 7 + 1) * 24 * 3600 * 1000

context('Instructions text', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: 'false' })
    cy.task('stubForAllowedRegions', { staffId: 'USER1' })
  })

  it('Instructions text should save and display when switching to summary page', () => {
    cy.task('stubGetUnallocatedCase')
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
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().clear()
    summaryPage.instructionsTextArea().type('Test Documents')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetDocuments')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
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
    cy.task('stubGetConfirmInstructions')
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.instructionsTextArea().should('have.value', 'Test Documents')
    // Must reset clock befoe changing the time
    cy.clock().then(clock => {
      clock.restore()
    })
    cy.clock(FOUR_WEEKS_AND_A_DAY_IN_MS)
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes').then(_ => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(localStorage.getItem('instructions-save-J678910-1')).to.be.null
    })
    const instructionsPageAfterTimeout = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPageAfterTimeout.instructionsTextArea().should('have.value', '')
  })

  it('Instructions hint text should display header text', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.clock()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.moreDetailHintHeader().should('exist')
    summaryPage
      .moreDetailHintHeader()
      .should(
        'contain.text',
        'Make notes for the practitioner who will be allocated this case. You can continue to edit notes which will be retained as you move through and review the case details.',
      )
  })
})
