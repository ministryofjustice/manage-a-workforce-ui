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
import WorkloadService from '../services/workloadService'
import config from '../config'
import { unescapeApostrophe } from '../utils/utils'

export default class FindUnallocatedCasesController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService,
  ) {}

  async findUnallocatedCases(req: Request, res: Response, pduCode: string): Promise<void> {
    const { token, username } = res.locals.user
    const teamCodes = await this.userPreferenceService.getTeamsUserPreference(token, username)
    const pduDetails = await this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode)
    await this.allocationsService.getUserRegionAccessForRegion(
      res.locals.user.token,
      res.locals.user.username,
      pduDetails.region.code,
    )

    const savedAllocationDemandSelection = await this.userPreferenceService.getAllocationDemandSelection(
      token,
      username,
    )

    const validUserPreference = pduDetails.teams.map(team => team.code).includes(savedAllocationDemandSelection.team)
    if (!validUserPreference) {
      await this.userPreferenceService.clearAllocationDemandPreference(token, username)
      res.redirect(`/pdu/${pduCode}/select-teams`)
    }

    const allocatedCasesCount = await this.workloadService.postAllocationHistoryCount(
      token,
      config.casesAllocatedSinceDate().toISOString(),
      teamCodes.items,
    )
    const allEstate = await this.probationEstateService.getAllEstateByRegionCode(token, pduDetails.region.code)

    const flashAllocationDemandSelected = req.flash('allocationDemandSelected')

    const formAllocationDemandSelected =
      flashAllocationDemandSelected != null && flashAllocationDemandSelected.length > 0
        ? (flashAllocationDemandSelected[0] as unknown as AllocationDemandSelected)
        : null

    const allocationDemandSelection = getAllocationDemandSelected(
      formAllocationDemandSelected,
      savedAllocationDemandSelection,
      allEstate,
    )
    const unallocatedCasesByTeam = allocationDemandSelection.team
      ? await this.allocationsService.getUnallocatedCasesByTeam(token, allocationDemandSelection.team)
      : []

    const unallocatedCases = unallocatedCasesByTeam.map(
      value =>
        new UnallocatedCase(
          unescapeApostrophe(value.name),
          value.crn,
          value.tier,
          value.sentenceDate,
          value.handoverDate,
          value.initialAppointment,
          value.status,
          value.offenderManager,
          value.convictionNumber,
          value.caseType,
          value.sentenceLength,
          value.outOfAreaTransfer,
          value.excluded,
          value.apopExcluded,
        ),
    )

    const pduOptions = getDropDownItems(
      Array.from(Object.entries(allEstate)),
      'Select PDU',
      allocationDemandSelection.pdu,
    )
    const ldus = allocationDemandSelection.pdu ? allEstate[allocationDemandSelection.pdu].ldus : []
    const lduOptions = getDropDownItems(
      Object.entries<AllLocalDeliveryUnit>(ldus),
      'Select LAU',
      allocationDemandSelection.ldu,
    )
    const teams = allocationDemandSelection.ldu
      ? ldus[allocationDemandSelection.ldu].teams.map(team => [team.code, team])
      : []
    const teamOptions = getDropDownItems(teams, 'Select team', allocationDemandSelection.team)

    req.session.confirmInstructionForm = null

    res.render('pages/find-unallocated-cases', {
      isFindUnalllocatedCasesPage: true,
      isCaseAllocationHistoryPage: false,
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
      teamSelected: allocationDemandSelection.team,
      pduCode,
      allocatedCasesCount: allocatedCasesCount.caseCount,
    })
  }

  async submitFindUnallocatedCases(req: Request, res: Response, pduCode: string, form): Promise<void> {
    const { token, username } = res.locals.user
    const findUnallocatedCasesForm = trimForm<FindUnallocatedCasesForm>(form)
    const errors = validate(
      findUnallocatedCasesForm,
      { pdu: 'required', ldu: 'required', team: 'required' },
      {
        'required.pdu': 'Select a Probation Delivery Unit (PDU)',
        'required.ldu': 'Select a Local Admin Unit (LAU)',
        'required.team': 'Select a team',
      },
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
    res.redirect(`/pdu/${pduCode}/find-unallocated`)
  }

  async clearFindUnallocatedCases(req: Request, res: Response, pduCode: string): Promise<void> {
    const { token, username } = res.locals.user
    await this.userPreferenceService.clearAllocationDemandPreference(token, username)
    res.redirect(`/pdu/${pduCode}/find-unallocated`)
  }
}

function getDropDownItems(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: [string, any][],
  defaultDropDownItemText: string,
  selectedItemValue: string,
): DropDownItem[] {
  return [{ value: '', text: defaultDropDownItemText }]
    .concat(
      items
        .map(([value, details]) => {
          return { value, text: details.name }
        })
        .sort((a, b) => (a.text >= b.text ? 1 : -1)),
    )
    .map(dropDownItem => {
      return { ...dropDownItem, selected: dropDownItem.value === selectedItemValue }
    })
}

function getAllocationDemandSelected(
  formAllocationDemandSelected: AllocationDemandSelected,
  savedAllocationDemandSelection: AllocationDemandSelected,
  allEstate: Map<string, AllProbationDeliveryUnit>,
): AllocationDemandSelected {
  const allocationDemandSelection = formAllocationDemandSelected || savedAllocationDemandSelection
  const pduSelected = allEstate[allocationDemandSelection.pdu] ? allocationDemandSelection.pdu : ''
  const lduSelected =
    pduSelected && allEstate[pduSelected].ldus[allocationDemandSelection.ldu] ? allocationDemandSelection.ldu : ''
  const teamSelected =
    lduSelected &&
    allEstate[allocationDemandSelection.pdu].ldus[allocationDemandSelection.ldu].teams.some(
      team => team.code === allocationDemandSelection.team,
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
