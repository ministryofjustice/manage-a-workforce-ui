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
    const [pduDetails, savedAllocationDemandSelection] = await Promise.all([
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
      this.userPreferenceService.getAllocationDemandSelection(token, username),
    ])
    const allEstate = await this.probationEstateService.getAllEstateByRegionCode(token, pduDetails.region.code)

    const flashAllocationDemandSelected = req.flash('allocationDemandSelected')

    const formAllocationDemandSelected =
      flashAllocationDemandSelected != null && flashAllocationDemandSelected.length > 0
        ? (flashAllocationDemandSelected[0] as unknown as AllocationDemandSelected)
        : null

    const allocationDemandSelection = getAllocationDemandSelected(
      formAllocationDemandSelected,
      savedAllocationDemandSelection,
      allEstate
    )
    const unallocatedCasesByTeam = allocationDemandSelection.team
      ? await this.allocationsService.getUnallocatedCasesByTeam(token, allocationDemandSelection.team)
      : []

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

    const pduOptions = getDropDownItems(
      Array.from(Object.entries(allEstate)),
      'Select PDU',
      allocationDemandSelection.pdu
    )
    const ldus = allocationDemandSelection.pdu ? allEstate[allocationDemandSelection.pdu].ldus : []
    const lduOptions = getDropDownItems(
      Object.entries<AllLocalDeliveryUnit>(ldus),
      'Select LDU',
      allocationDemandSelection.ldu
    )
    const teams = allocationDemandSelection.ldu
      ? ldus[allocationDemandSelection.ldu].teams.map(team => [team.code, team])
      : []
    const teamOptions = getDropDownItems(teams, 'Select team', allocationDemandSelection.team)

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
      teamCode: savedAllocationDemandSelection.team,
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
      await this.userPreferenceService.clearAllocationDemandPreference(token, username)
    } else {
      await this.userPreferenceService.saveAllocationDemandPreference(token, username, allocationDemandSelected)
    }
    // eslint-disable-next-line security-node/detect-dangerous-redirects
    res.redirect(`/probationDeliveryUnit/${pduCode}/find-unallocated`)
  }

  async clearFindUnallocatedCases(req: Request, res: Response, pduCode: string): Promise<void> {
    const { token, username } = res.locals.user
    await this.userPreferenceService.clearAllocationDemandPreference(token, username)
    // eslint-disable-next-line security-node/detect-dangerous-redirects
    res.redirect(`/probationDeliveryUnit/${pduCode}/find-unallocated`)
  }
}

function getDropDownItems(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: [string, any][],
  defaultDropDownItemText: string,
  selectedItemValue: string
): DropDownItem[] {
  return [{ value: '', text: defaultDropDownItemText }]
    .concat(
      items
        .map(([value, details]) => {
          return { value, text: details.name }
        })
        .sort((a, b) => (a.text >= b.text ? 1 : -1))
    )
    .map(dropDownItem => {
      return { ...dropDownItem, selected: dropDownItem.value === selectedItemValue }
    })
}

function getAllocationDemandSelected(
  formAllocationDemandSelected: AllocationDemandSelected,
  savedAllocationDemandSelection: AllocationDemandSelected,
  allEstate: Map<string, AllProbationDeliveryUnit>
): AllocationDemandSelected {
  const allocationDemandSelection = formAllocationDemandSelected || savedAllocationDemandSelection
  const pduSelected = allEstate[allocationDemandSelection.pdu] ? allocationDemandSelection.pdu : ''
  const lduSelected =
    pduSelected && allEstate[pduSelected].ldus[allocationDemandSelection.ldu] ? allocationDemandSelection.ldu : ''
  const teamSelected =
    lduSelected &&
    allEstate[allocationDemandSelection.pdu].ldus[allocationDemandSelection.ldu].teams.some(
      team => team.code === allocationDemandSelection.team
    )
      ? allocationDemandSelection.team
      : ''
  return {
    pdu: pduSelected,
    ldu: lduSelected,
    team: teamSelected,
  }
}

type DropDownItem = {
  value: string
  text: string
}
