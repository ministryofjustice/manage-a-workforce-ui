import Page from '../../pages/page'
import ReallocationsSearchPage from '../../pages/reallocations/search'

context('Reallocations Search', () => {
  let reallocationsSearchPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/reallocations')
    reallocationsSearchPage = Page.verifyOnPage(ReallocationsSearchPage)
  })

  it('should display the correct LDU and PDU', () => {
    reallocationsSearchPage.heading().should('contain.text', 'A Probation Delivery Unit')
    reallocationsSearchPage.caption().should('contain.text', 'A Region')
  })

  it('should display the search component', () => {
    reallocationsSearchPage.search().should('contain.text', 'Find a person on probation to reallocate')
    reallocationsSearchPage.search().should('contain.text', 'You can search by CRN')
    reallocationsSearchPage.search().get('input#crn').should('be.visible')
  })

  it('should display an error for an invalid CRN', () => {
    reallocationsSearchPage.search().get('input#crn').type('BADCRN')
    reallocationsSearchPage.search().get('button').click()
    reallocationsSearchPage.search().should('contain.text', 'Enter a valid CRN to search')
  })

  it('should display an error when case not found', () => {
    cy.task('stubCrnLookupError', { crn: 'A123456' })
    cy.task('stubForStaffLaoStatusByCrns', ['A123456'])
    reallocationsSearchPage.search().get('input#crn').type('A123456')
    reallocationsSearchPage.search().get('button').click()
    reallocationsSearchPage.search().should('contain.text', 'No result found for this CRN.')
  })

  it('should display an error when case is unallocated', () => {
    cy.task('stubCrnLookup', { crn: 'A123456', allocated: false })
    cy.task('stubForStaffLaoStatusByCrns', ['A123456'])
    reallocationsSearchPage.search().get('input#crn').type('A123456')
    reallocationsSearchPage.search().get('button').click()
    reallocationsSearchPage.search().should('contain.text', 'No result found for this CRN.')
  })

  it('should display case details when a valid CRN is entered', () => {
    cy.task('stubCrnLookup', { crn: 'A123456' })
    cy.task('stubForStaffLaoStatusByCrns', [{ crn: 'A123456' }])
    cy.task('stubGetCrnAccess', { crn: 'A123456' })

    reallocationsSearchPage.search().get('input#crn').type('A123456')
    reallocationsSearchPage.search().get('button').click()

    reallocationsSearchPage.case().should('exist')

    reallocationsSearchPage
      .case()
      .get('tbody tr')
      .first()
      .within(() => {
        cy.get('td').should('contain.text', 'Jane Doe')
        cy.get('td').should('contain.text', 'A123456')
        cy.get('td').should('contain.text', '25 May 1958')
        cy.get('td').should('contain.text', 'John Doe')
      })
  })

  it('correctly displays excluded cases', () => {
    cy.task('stubCrnLookup', { crn: 'A123456' })
    cy.task('stubForStaffLaoStatusByCrns', [{ crn: 'A123456', userRestricted: true, userExcluded: false }])
    cy.task('stubGetCrnAccess', { crn: 'A123456' })
    reallocationsSearchPage.search().get('input#crn').type('A123456')
    reallocationsSearchPage.search().get('button').click()

    reallocationsSearchPage.case().should('exist')

    reallocationsSearchPage
      .case()
      .get('tbody tr')
      .first()
      .within(() => {
        cy.get('td').should('not.contain.text', 'Jane Doe')
        cy.get('td').should('contain.text', '**********************')
        cy.get('td').should('contain.text', 'Restricted access')
        cy.get('td').should('contain.text', 'A123456')
        cy.get('td').should('not.contain.text', '25 May 1958')
        cy.get('td').should('not.contain.text', 'Unallocated Staff')
        cy.get('td').should(
          'contain.text',
          'This is a restricted case. Check NDelius if you require access or further information.',
        )
      })
  })

  it('correctly displays LAO cases', () => {
    cy.task('stubCrnLookup', { crn: 'A123456' })
    cy.task('stubForStaffLaoStatusByCrns', [{ crn: 'A123456', userRestricted: false, userExcluded: true }])
    cy.task('stubGetCrnAccess', { crn: 'A123456' })
    reallocationsSearchPage.search().get('input#crn').type('A123456')
    reallocationsSearchPage.search().get('button').click()

    reallocationsSearchPage.case().should('exist')

    reallocationsSearchPage
      .case()
      .get('tbody tr')
      .first()
      .within(() => {
        cy.get('td').should('contain.text', 'Jane Doe')
        cy.get('td').should('contain.text', 'Restricted access')
        cy.get('td').should('contain.text', 'A123456')
        cy.get('td').should('contain.text', '25 May 1958')
        cy.get('td').should('contain.text', 'John Doe')
      })
  })

  it('correctly displays Out of Area cases', () => {
    cy.task('stubCrnLookup', { crn: 'A123456' })
    cy.task('stubForStaffLaoStatusByCrns', [{ crn: 'A123456' }])
    cy.task('stubGetCrnAccess', { crn: 'A123456', status: 403 })
    reallocationsSearchPage.search().get('input#crn').type('A123456')
    reallocationsSearchPage.search().get('button').click()

    reallocationsSearchPage.case().should('exist')

    reallocationsSearchPage
      .case()
      .get('tbody tr')
      .first()
      .within(() => {
        cy.get('td').should('contain.text', 'Jane Doe')
        cy.get('td').should('contain.text', 'Not in region')
        cy.get('td').should('contain.text', 'A123456')
        cy.get('td').should('contain.text', '25 May 1958')
        cy.get('td').should('contain.text', 'John Doe')
      })
  })

  it('team data displayed in table', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Team 1',
          Workload: '77%',
          Cases: '2',
        },
      ])
    cy.get('table')
      .contains('tr', 'Team 1')
      .find('a')
      .should('have.attr', 'href')
      .and('include', '/pdu/PDU1/TM1/reallocations/team-workload')
  })
})
