import { Request, Response } from 'express'
import type { FindUnallocatedCasesForm } from 'forms'
import ProbationEstateService from '../services/probationEstateService'
import validate from '../validation/validation'
import trimForm from '../utils/trim'
import UserPreferenceService from '../services/userPreferenceService'
import AllProbationDeliveryUnit from '../models/AllProbationDeliveryUnit'
import AllocationDemandSelected from '../models/AllocationDemandSelected'
import AllLocalDeliveryUnit from '../models/AllLocalDeliveryUnit'
import AllocationsService from '../services/allocationsService'
import UnallocatedCase from './data/UnallocatedCase'

export default class FindUnallocatedCasesController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly allocationsService: AllocationsService
  ) {}

  async findUnallocatedCases(req: Request, res: Response, pduCode: string): Promise<void> {
    const { token, username } = res.locals.user
    const [pduDetails, allocationDemandTeamSelection] = await Promise.all([
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
      this.userPreferenceService.getAllocationDemandSelection(token, username),
    ])
    const allEstate = await this.probationEstateService.getAllEstateByRegionCode(token, pduDetails.region.code)
    const userSelectionInEstate = selectionInEstate(allEstate, allocationDemandTeamSelection)
    const unallocatedCasesByTeam = userSelectionInEstate
      ? await this.allocationsService.getUnallocatedCasesByTeam(token, allocationDemandTeamSelection.team)
      : []

    const flashAllocationDemandSelected = req.flash('allocationDemandSelected')

    const allocationDemandSelected = (
      flashAllocationDemandSelected != null && flashAllocationDemandSelected.length > 0
        ? flashAllocationDemandSelected[0]
        : {
            pdu: '',
            ldu: '',
            team: '',
          }
    ) as AllocationDemandSelected
    const unallocatedCases = unallocatedCasesByTeam.map(
      value =>
        new UnallocatedCase(
          value.name,
          value.crn,
          value.tier,
          value.sentenceDate,
          value.initialAppointment,
          value.status,
          value.offenderManager,
          value.convictionNumber,
          value.caseType,
          value.sentenceLength
        )
    )

    const pduOptions = getPduOptions(
      allEstate,
      allocationDemandTeamSelection,
      userSelectionInEstate,
      allocationDemandSelected
    )
    const lduOptions = getLduOptions(
      allEstate,
      allocationDemandTeamSelection,
      userSelectionInEstate,
      allocationDemandSelected
    )
    const teamOptions = getTeamOptions(allEstate, allocationDemandTeamSelection, userSelectionInEstate)

    res.render('pages/find-unallocated-cases', {
      pduDetails,
      title: 'Unallocated cases | Manage a workforce',
      errors: req.flash('errors') || [],
      dropDownSelectionData: JSON.stringify(allEstate),
      pduOptions,
      lduOptions,
      teamOptions,
      unallocatedCases,
      casesLength: unallocatedCases.length,
      teamCode: allocationDemandTeamSelection.team,
    })
  }

  async submitFindUnallocatedCases(req: Request, res: Response, pduCode: string, form): Promise<void> {
    const { token, username } = res.locals.user
    const findUnallocatedCasesForm = trimForm<FindUnallocatedCasesForm>(form)
    const errors = validate(
      findUnallocatedCasesForm,
      { pdu: 'required', ldu: 'required', team: 'required' },
      {
        'required.pdu': 'Select a Probation Delivery Unit',
        'required.ldu': 'Select a Local Delivery Unit',
        'required.team': 'Select a team',
      }
    )
    const allocationDemandSelected = {
      pdu: findUnallocatedCasesForm.pdu,
      ldu: findUnallocatedCasesForm.ldu,
      team: findUnallocatedCasesForm.team,
    }
    if (errors.length) {
      req.flash('errors', errors)
      req.flash('allocationDemandSelected', [allocationDemandSelected])
    } else {
      await this.userPreferenceService.saveAllocationDemandPreference(token, username, allocationDemandSelected)
    }
    // eslint-disable-next-line security-node/detect-dangerous-redirects
    res.redirect(`/probationDeliveryUnit/${pduCode}/find-unallocated`)
  }
}

function getPduOptions(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected,
  userSelectionInEstate: boolean,
  allocationDemandSelected: AllocationDemandSelected
): Option[] {
  const pduSelected = userSelectionInEstate ? allocationDemandTeamSelection.pdu : allocationDemandSelected.pdu
  return [{ value: '', text: 'Select PDU' }]
    .concat(
      Array.from(Object.entries(allEstate))
        .map(([allPduCode, allPduDetails]) => {
          return { value: allPduCode, text: allPduDetails.name }
        })
        .sort((a, b) => (a.text >= b.text ? 1 : -1))
    )
    .map(pduOption => {
      return { ...pduOption, selected: pduOption.value === pduSelected }
    })
}

function getLduOptions(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected,
  userSelectionInEstate: boolean,
  allocationDemandSelected: AllocationDemandSelected
): Option[] {
  const pduSelected = userSelectionInEstate ? allocationDemandTeamSelection.pdu : allocationDemandSelected.pdu
  const lduSelected = userSelectionInEstate ? allocationDemandTeamSelection.ldu : allocationDemandSelected.ldu
  return [{ value: '', text: 'Select LDU' }]
    .concat(
      userSelectionInEstate || allocationDemandSelected.ldu
        ? Object.entries<AllLocalDeliveryUnit>(allEstate[pduSelected].ldus)
            .map(([lduCode, lduDetails]) => {
              return { value: lduCode, text: lduDetails.name }
            })
            .sort((a, b) => (a.text >= b.text ? 1 : -1))
        : []
    )
    .map(lduOption => {
      return { ...lduOption, selected: lduOption.value === lduSelected }
    })
}

function getTeamOptions(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected,
  userSelectionInEstate: boolean
): Option[] {
  const teamSelected = userSelectionInEstate ? allocationDemandTeamSelection.team : ''
  return [{ value: '', text: 'Select team' }]
    .concat(
      userSelectionInEstate
        ? allEstate[allocationDemandTeamSelection.pdu].ldus[allocationDemandTeamSelection.ldu].teams
            .map(team => {
              return { value: team.code, text: team.name }
            })
            .sort((a, b) => (a.text >= b.text ? 1 : -1))
        : []
    )
    .map(teamOption => {
      return { ...teamOption, selected: teamOption.value === teamSelected }
    })
}

function selectionInEstate(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected
): boolean {
  return (
    allEstate[allocationDemandTeamSelection.pdu] &&
    allEstate[allocationDemandTeamSelection.pdu].ldus[allocationDemandTeamSelection.ldu] &&
    allEstate[allocationDemandTeamSelection.pdu].ldus[allocationDemandTeamSelection.ldu].teams.some(
      team => team.code === allocationDemandTeamSelection.team
    )
  )
}

type Option = {
  value: string
  text: string
}
