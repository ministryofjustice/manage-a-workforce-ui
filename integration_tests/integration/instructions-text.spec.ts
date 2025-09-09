import DocumentsPage from '../pages/documents'
import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ProbationRecordPage from '../pages/probationRecord'
import RiskPage from '../pages/risk'

context('Instructions text', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: 'false' })
    cy.task('stubForAllowedRegions', { staffId: 'USER1' })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
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
    /* eslint-disable-next-line cypress/no-unnecessary-waiting */
    cy.wait(1000)
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
    /* eslint-disable-next-line cypress/no-unnecessary-waiting */
    cy.wait(1000)
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
    /* eslint-disable-next-line cypress/no-unnecessary-waiting */
    cy.wait(1000)
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
    /* eslint-disable-next-line cypress/no-unnecessary-waiting */
    cy.wait(1000)
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetDocuments')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/convictions/1/documents')
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.instructionsTextArea().should('have.value', 'Test Documents')
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
