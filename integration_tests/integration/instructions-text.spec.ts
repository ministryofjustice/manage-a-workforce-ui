import DocumentsPage from '../pages/documents'
import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ProbationRecordPage from '../pages/probationRecord'
import RiskPage from '../pages/risk'

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
    cy.task('stubGetCurrentlyManagedCaseOverview', '1')
    cy.task('stubGetDocuments')
    cy.visit('/pdu/PDU1/J678910/convictions/1/documents')
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.instructionsTextArea().should('have.value', 'Test Documents')
  })
})
