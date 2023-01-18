import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

context('Submit find Unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceEmptyAllocationDemand')
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('must show error banner when submitting no selections', () => {
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage
      .errorSummary()
      .trimTextContent()
      .should(
        'contain',
        'There is a problem Select a Probation Delivery Unit Select a Local Delivery Unit Select a team'
      )
  })

  it('must keep pdu selection after submitting partial selection', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
  })

  it('must keep ldu selection after submitting partial selection', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage.select('ldu').select('LDU1')
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('First Local Delivery Unit')
  })

  it('must favour form submission over saved selection', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    findUnallocatedCasesPage.select('pdu').select(0)
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('Select PDU')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('Select LDU')
    findUnallocatedCasesPage.select('team').find(':selected').contains('Select team')
  })

  it('selecting PDU populates LDU with correct options', () => {
    findUnallocatedCasesPage.select('pdu').select('PDU1')
    findUnallocatedCasesPage
      .select('ldu')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select LDU',
        },
        {
          optionValue: 'LDU1',
          optionContent: 'First Local Delivery Unit',
        },
        {
          optionValue: 'LDU2',
          optionContent: 'Second Local Delivery Unit',
        },
      ])
  })

  it('selecting LDU populates Team with correct options', () => {
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
          optionContent: 'Select LDU',
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
    findUnallocatedCasesPage.button().click()
    cy.task('verifyPutUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    Page.verifyOnPage(FindUnallocatedPage)
  })
})
