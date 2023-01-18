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
})
