import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

context('Submit find Unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceEmptyAllocationDemand')
    cy.task('stubCaseAllocationHistoryCount', 20)
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('must show error banner when submitting no selections', () => {
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage
      .errorSummary()
      .trimTextContent()
      .should(
        'contain',
        'There is a problem Select a Probation Delivery Unit (PDU) Select a Local Admin Unit (LAU) Select a team',
      )
  })

  it('must keep pdu selection after submitting partial selection', () => {
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
  })

  it('must keep ldu selection after submitting partial selection', () => {
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.select('ldu').select('LDU1')
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('First Local Admin Unit')
  })

  it('must favour form submission over saved selection', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.select('pdu').select(0)
    findUnallocatedCasesPage.saveViewButton().click()
    cy.task('verifyClearUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('Select PDU')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('Select LAU')
    findUnallocatedCasesPage.select('team').find(':selected').contains('Select team')
  })

  it('selecting PDU populates LAU with correct options', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage
      .select('ldu')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select LAU',
        },
        {
          optionValue: 'LDU1',
          optionContent: 'First Local Admin Unit',
        },
        {
          optionValue: 'LDU2',
          optionContent: 'Second Local Admin Unit',
        },
      ])
  })

  it('selecting LAU populates Team with correct options', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.select('ldu').select('LDU1')
    findUnallocatedCasesPage
      .select('team')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select team',
        },
        {
          optionValue: 'TM1',
          optionContent: 'First Team',
        },
        {
          optionValue: 'TM2',
          optionContent: 'Second Team',
        },
      ])
  })

  it('unselecting PDU clears LDU and team', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.select('ldu').select('LDU1')
    findUnallocatedCasesPage.select('team').select('TM1')
    findUnallocatedCasesPage.select('pdu').select(0)
    findUnallocatedCasesPage
      .select('ldu')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select LAU',
        },
      ])
    findUnallocatedCasesPage
      .select('team')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select team',
        },
      ])
  })

  it('unselecting LDU clears team', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.select('ldu').select('LDU1')
    findUnallocatedCasesPage.select('team').select('TM1')
    findUnallocatedCasesPage.select('ldu').select(0)
    findUnallocatedCasesPage
      .select('team')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select team',
        },
      ])
  })

  it('selecting all options and saving stores in user preference', () => {
    cy.task('stubPutUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.select('ldu').select('LDU1')
    findUnallocatedCasesPage.select('team').select('TM1')
    findUnallocatedCasesPage.continueButton().click()
    cy.task('verifyPutUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    Page.verifyOnPage(FindUnallocatedPage)
  })
})
