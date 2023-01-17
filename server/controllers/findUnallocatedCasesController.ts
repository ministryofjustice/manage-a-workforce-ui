import { Request, Response } from 'express'
import type { FindUnallocatedCasesForm } from 'forms'
import ProbationEstateService from '../services/probationEstateService'
import validate from '../validation/validation'
import trimForm from '../utils/trim'
import UserPreferenceService from '../services/userPreferenceService'
import AllProbationDeliveryUnit from '../models/AllProbationDeliveryUnit'
import AllocationDemandSelected from '../models/AllocationDemandSelected'
import AllLocalDeliveryUnit from '../models/AllLocalDeliveryUnit'

export default class FindUnallocatedCasesController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService
  ) {}

  async findUnallocatedCases(req: Request, res: Response, pduCode: string): Promise<void> {
    const { token, username } = res.locals.user
    const pduDetails = await this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode)
    const allEstate = await this.probationEstateService.getAllEstateByRegionCode(token, pduDetails.region.code)
    const allocationDemandTeamSelection = await this.userPreferenceService.getAllocationDemandSelection(token, username)
    const pduOptions = getPduOptions(allEstate, allocationDemandTeamSelection)

    const lduOptions = getLduOptions(allEstate, allocationDemandTeamSelection)

    const teamOptions = getTeamOptions(allEstate, allocationDemandTeamSelection)

    res.render('pages/find-unallocated-cases', {
      pduDetails,
      title: 'Unallocated cases | Manage a workforce',
      errors: req.flash('errors') || [],
      dropDownSelectionData: JSON.stringify(allEstate),
      pduOptions,
      lduOptions,
      teamOptions,
    })
  }

  async submitFindUnallocatedCases(req: Request, res: Response, pduCode: string, form): Promise<void> {
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

    req.flash('errors', errors)
    // eslint-disable-next-line security-node/detect-dangerous-redirects
    res.redirect(`/probationDeliveryUnit/${pduCode}/find-unallocated`)
  }
}

function getPduOptions(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected
): Option[] {
  return [{ value: '', text: 'Select PDU' }]
    .concat(
      Array.from(Object.entries(allEstate))
        .map(([allPduCode, allPduDetails]) => {
          return { value: allPduCode, text: allPduDetails.name }
        })
        .sort((a, b) => (a.text >= b.text ? 1 : -1))
    )
    .map(pduOption => {
      return { ...pduOption, selected: pduOption.value === allocationDemandTeamSelection.pdu }
    })
}

function getLduOptions(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected
): Option[] {
  return [{ value: '', text: 'Select LDU' }]
    .concat(
      allocationDemandTeamSelection.pdu
        ? Object.entries<AllLocalDeliveryUnit>(allEstate[allocationDemandTeamSelection.pdu].ldus)
            .map(([lduCode, lduDetails]) => {
              return { value: lduCode, text: lduDetails.name }
            })
            .sort((a, b) => (a.text >= b.text ? 1 : -1))
        : []
    )
    .map(lduOption => {
      return { ...lduOption, selected: lduOption.value === allocationDemandTeamSelection.ldu }
    })
}

function getTeamOptions(
  allEstate: Map<string, AllProbationDeliveryUnit>,
  allocationDemandTeamSelection: AllocationDemandSelected
): Option[] {
  return [{ value: '', text: 'Select team' }]
    .concat(
      allocationDemandTeamSelection.ldu
        ? allEstate[allocationDemandTeamSelection.pdu].ldus[allocationDemandTeamSelection.ldu].teams
            .map(team => {
              return { value: team.code, text: team.name }
            })
            .sort((a, b) => (a.text >= b.text ? 1 : -1))
        : []
    )
    .map(teamOption => {
      return { ...teamOption, selected: teamOption.value === allocationDemandTeamSelection.team }
    })
}

type Option = {
  value: string
  text: string
}
