import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

import config from '../../server/config'
import { allocationsByTeamResponse } from '../mockApis/allocations'
// eslint-disable-next-line import/named
import { ColumnSortExpectations, sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Find Unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceEmptyAllocationDemand')
    cy.task('stubCaseAllocationHistoryCount', 20)
    cy.signIn()
    cy.visit('/pdu/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('Region visible on page', () => {
    findUnallocatedCasesPage.region().should('contain.text', 'A Region')
  })

  it('Probation Delivery Unit name visible on page', () => {
    findUnallocatedCasesPage.probationDeliveryUnit().should('contain.text', 'A Probation Delivery Unit')
  })

  it('Primary nav visible on page', () => {
    findUnallocatedCasesPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    findUnallocatedCasesPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    findUnallocatedCasesPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    findUnallocatedCasesPage
      .navLink('courts-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    findUnallocatedCasesPage
      .navLink('search-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
  })

  it('Sub nav visible on page', () => {
    findUnallocatedCasesPage.subNav().should('contain', 'Unallocated cases')
  })

  it('Shows link to Edit my teams list', () => {
    findUnallocatedCasesPage.manageMyTeamsLink().should('equal', '/pdu/PDU1/select-teams')
  })

  it('large heading visible on page', () => {
    findUnallocatedCasesPage.largeHeading().should('contain', 'Unallocated cases')
  })

  it('filter heading visible on page', () => {
    findUnallocatedCasesPage.filterHeading().should('contain', 'Select a team to view unallocated case')
  })

  it('select pdu visible on page', () => {
    findUnallocatedCasesPage.selectLabel('pdu').should('contain', 'Probation delivery unit (PDU)')
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('Select PDU')
  })

  it('select ldu visible on page', () => {
    findUnallocatedCasesPage.selectLabel('ldu').should('contain', 'Local delivery unit (LDU)')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('Select LDU')
  })

  it('select team visible on page', () => {
    findUnallocatedCasesPage.selectLabel('team').should('contain', 'Team')
    findUnallocatedCasesPage.select('team').find(':selected').contains('Select team')
  })

  it('save and view selection button visible', () => {
    findUnallocatedCasesPage.saveViewButton().should('contain', 'Save and view selection')
  })

  it('clear link visible', () => {
    findUnallocatedCasesPage.clearLink().should('contain', 'Clear')
  })

  it('all options exist for PDUs', () => {
    findUnallocatedCasesPage
      .select('pdu')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select PDU',
        },
        {
          optionValue: 'PDU1',
          optionContent: 'First Probation Delivery Unit',
        },
        {
          optionValue: 'PDU2',
          optionContent: 'Second Probation Delivery Unit',
        },
      ])
  })

  it('already having allocation demand saved selects the correct PDU, LDU, and team from drop downs', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('First Local Delivery Unit')
    findUnallocatedCasesPage.select('team').find(':selected').contains('First Team')
  })

  it('ignores old team codes selected in user preference', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'OLDTEAM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'OLDTEAM1' })
    cy.reload()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('First Local Delivery Unit')
  })

  it('allocation demand selection in different estate has default options selected', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU3', lduCode: 'LDU5', teamCode: 'TM9' })
    cy.reload()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('Select PDU')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('Select LDU')
    findUnallocatedCasesPage.select('team').find(':selected').contains('Select team')
  })

  it('retrieve allocation demand for team saved in user preference allocation demand', () => {
    const outOfAreaTransferCase = {
      name: 'John Doe',
      crn: 'X678911',
      tier: 'C1',
      sentenceDate: '2023-12-01',
      handoverDate: null,
      initialAppointment: {
        date: '2023-12-20',
        staff: {
          name: {
            forename: 'Unallocated',
            middlename: null,
            surname: 'Staff',
            combinedName: 'Unallocated Staff',
          },
        },
      },
      status: 'Currently managed',
      offenderManager: {
        forenames: 'Jane',
        surname: 'Doe',
        grade: 'SPO',
      },
      convictionNumber: 1,
      caseType: 'COMMUNITY',
      outOfAreaTransfer: true,
    }
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    const response = allocationsByTeamResponse
    response.push(outOfAreaTransferCase)
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1', response })
    cy.reload()
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongJ678910',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'COM Handover date': 'N/A',
          'Initial appointment date': '1 September 2021Unallocated officer',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '10 May 2021',
          'COM Handover date': '3 January 2025',
          'Initial appointment date': 'Not neededCustody case (5 Years)',
          'Probation status': 'Previously managed(John Agard)',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 July 2023',
          'COM Handover date': 'N/A',
          'Initial appointment date': '1 September 2023Reece John Spears',
          'Probation status': 'New to probation',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '16 February 2022',
          'COM Handover date': 'N/A',
          'Initial appointment date': '25 March 2022Micheala Smith',
          'Probation status': 'New to probation',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 June 2021',
          'COM Handover date': 'N/A',
          'Initial appointment date': '15 June 2021John Paul Tinker',
          'Probation status': 'Previously managed',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 March 2024',
          'COM Handover date': 'N/A',
          'Initial appointment date': '25 April 2024Lando Nickson',
          'Probation status': 'Previously managed',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 May 2021',
          'COM Handover date': 'N/A',
          'Initial appointment date': 'Not foundCheck with your team',
          'Probation status': 'Previously managed',
        },
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '10 May 2021',
          'COM Handover date': 'N/A',
          'Initial appointment date': '21 August 2021Emma Marie Williams',
          'Probation status': 'Currently managed(Richard Moore)',
        },
        {
          'Name / CRN': 'Daffy DuckX768522',
          Tier: 'C1',
          'Sentence date': '1 March 2000',
          'COM Handover date': '3 October 2024',
          'Initial appointment date': 'Not neededCustody case (25 Years)',
          'Probation status': 'Previously managed(John Agard)',
        },
        {
          'Name / CRN': 'John DoeX678911  Actionrequired',
          Tier: 'C1',
          'Sentence date': '1 December 2023',
          'COM Handover date': 'N/A',
          'Initial appointment date':
            'This case is sitting in a different area, and the transfer process must be completed in NDelius before it can be allocated through the service. You can still review the case details.',
        },
      ])
  })

  it('clicking clear link removes user preference', () => {
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.clearLink().click()
    cy.task('verifyClearUserPreferenceAllocationDemand')
  })

  it('Sub nav visible on page with case count', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'TM1',
      response: [
        {
          teamCode: 'TM1',
          caseCount: 8,
        },
      ],
    })
    cy.reload()
    findUnallocatedCasesPage
      .subNav()
      .should('contain', 'Unallocated cases (8)')
      .and('contain', 'Cases allocated in last 30 days (20)')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubOverOneHundredAllocationsByTeam', 'TM1')
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'TM1',
      response: [
        {
          teamCode: 'TM1',
          caseCount: 100,
        },
      ],
    })
    cy.reload()
    findUnallocatedCasesPage.subNavLink().should('contain.text', 'Unallocated cases (99+)')
  })

  it('Must show 99+ in subnav when cases allocated in last 30 days are greater than 99', () => {
    cy.task('stubCaseAllocationHistoryCount', 100)
    cy.reload()
    findUnallocatedCasesPage.subNavLink().should('contain.text', 'Cases allocated in last 30 days (99+)')
  })

  it('no table or content exists before save', () => {
    cy.get('table').should('not.exist')
    findUnallocatedCasesPage.noCasesBody().should('not.exist')
  })

  it('This tab is highlighted', () => {
    findUnallocatedCasesPage
      .highlightedTab()
      .should('contain.text', 'Unallocated cases')
      .and('not.contain.text', 'Cases allocated in last 30 days')
  })

  it('navigate to case history page via sub nav', () => {
    findUnallocatedCasesPage.allocationHistorySubNavLink().click()
    cy.url().should('contain', 'pdu/PDU1/case-allocation-history')
  })

  const generateSortExpectations = (): Array<ColumnSortExpectations> => {
    return [
      {
        columnHeaderName: 'Name / CRN',
        orderedData: [
          // we order by CRN not name in this column
          'C234432',
          'C567654',
          'E124321',
          'F5635632',
          'J678910',
          'L786545',
          'P125643',
          'P567654',
          'X768522',
        ],
      },
      {
        columnHeaderName: 'Tier',
        // tier sorts by tierOrder which is different to the alpha chars below (which is wy D1 comes before C1)
        orderedData: ['D1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C2', 'C2', 'C3'],
      },
      {
        columnHeaderName: 'Sentence date',
        orderedData: [
          '1 March 2000',
          '10 May 2021',
          '10 May 2021',
          '25 May 2021',
          '1 June 2021',
          '1 September 2021',
          '16 February 2022',
          '23 July 2023',
          '1 March 2024',
        ],
      },
      {
        columnHeaderName: 'COM Handover date',
        orderedData: ['3 October 2024', '3 January 2025', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      },
      {
        columnHeaderName: 'Initial appointment date',
        orderedData: [
          '15 June 2021',
          '21 August 2021',
          '1 September 2021',
          '25 March 2022',
          '1 September 2023',
          '25 April 2024',
          'Not',
          'Not',
          'Not',
        ],
      },
      {
        columnHeaderName: 'Probation status',
        orderedData: [
          'Currently managed',
          'Currently managed',
          'New to probation',
          'New to probation',
          'Previously managed',
          'Previously managed',
          'Previously managed',
          'Previously managed',
          'Previously managed',
        ],
      },
    ]
  }

  it('should show the column the table is currently sorted by', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    cy.get('table').within(() => cy.contains('button', 'Name / CRN'))

    const sortExpectations = generateSortExpectations()
    sortDataAndAssertSortExpectations(1, sortExpectations, false)
  })

  it('persists sort order when refreshing the page', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    cy.get('table').within(() => cy.contains('button', 'Name / CRN').click())

    cy.get('table').within(() => cy.contains('button', 'Name / CRN').should('have.attr', { 'aria-sort': 'ascending' }))

    cy.reload()

    cy.get('table').within(() => cy.contains('button', 'Name / CRN').should('have.attr', { 'aria-sort': 'ascending' }))
  })
})
