import { Request, Response } from 'express'
import WorkloadService from '../services/workloadService'
import ProbationEstateService from '../services/probationEstateService'
import config from '../config'
import UserPreferenceService from '../services/userPreferenceService'
import AllocationsService from '../services/allocationsService'

export default class AllocationHistoryController {
  constructor(
    private readonly workloadService: WorkloadService,
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly allocationService: AllocationsService,
  ) {}

  async getCasesAllocatedByTeam(req: Request, res: Response, pduCode): Promise<void> {
    const { token, username } = res.locals.user
    console.log(`PDU 3 ${res.locals.user.username}, ${pduCode}`)
    await this.allocationService.getUserRegionAccessForPdu(res.locals.user.token, res.locals.user.username, pduCode)

    const [pduDetails, teamsUserPreference] = await Promise.all([
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
      this.userPreferenceService.getTeamsUserPreference(token, username),
    ])
    const teamCodes = teamsUserPreference.items
    const teams = await this.probationEstateService.getTeamsByCode(token, teamCodes)
    const caseAllocationHistory = await this.workloadService.postAllocationHistory(
      token,
      config.casesAllocatedSinceDate().toISOString(),
      teamCodes,
    )
    const caseAllocationDetails = await Promise.all(
      caseAllocationHistory.cases.map(async caseAllocation => {
        const laoStatus = await this.allocationService.getLAOStatusforAllocation(token, caseAllocation.crn)
        return {
          name: caseAllocation.name.combinedName,
          crn: caseAllocation.crn,
          tier: caseAllocation.tier,
          allocationDate: caseAllocation.allocatedOn,
          staffName: caseAllocation.staff?.name?.combinedName,
          staffCode: caseAllocation.staff?.code,
          pduCode,
          allocatedBy: caseAllocation.allocatingSpo,
          team: caseAllocation.teamCode,
          apopExcluded: laoStatus.isRedacted,
          excluded: laoStatus.isRestricted,
        }
      }),
    )
    const casesByTeam = caseAllocationDetails.reduce(
      (acc, caseAllocation) => ({
        ...acc,
        [caseAllocation.team]: [...(acc[caseAllocation.team] || []), caseAllocation],
      }),
      {},
    )
    res.render('pages/case-allocation-history', {
      isFindUnalllocatedCasesPage: false,
      isCaseAllocationHistoryPage: true,
      title: 'Cases allocated in last 7 days | Manage a workforce',
      pduCode,
      pduDetails,
      casesLength: 0,
      allocatedCasesCount: caseAllocationDetails.length,
      allocatedCases: caseAllocationDetails,
      allocatedCasesByTeam: casesByTeam,
      lastUpdatedOn: new Date(),
      teams,
    })
  }

  async getCasesAllocated(req: Request, res: Response, pduCode): Promise<void> {
    const { token } = res.locals.user

    console.log(`PDU 4 ${res.locals.user.username}, ${pduCode}`)
    await this.allocationService.getUserRegionAccessForPdu(res.locals.user.token, res.locals.user.username, pduCode)

    const [pduDetails, caseAllocationHistory] = await Promise.all([
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
      this.workloadService.getAllocationHistory(token, config.casesAllocatedSinceDate().toISOString()),
    ])

    const caseAllocationDetails = caseAllocationHistory.cases
      .map(caseAllocation => {
        return {
          name: caseAllocation.name.combinedName,
          crn: caseAllocation.crn,
          tier: caseAllocation.tier,
          allocationDate: caseAllocation.allocatedOn,
          staffName: caseAllocation.staff?.name?.combinedName,
        }
      })
      .sort((a, b) => Date.parse(b.allocationDate) - Date.parse(a.allocationDate))

    res.render('pages/case-allocation-history', {
      isFindUnalllocatedCasesPage: false,
      isCaseAllocationHistoryPage: true,
      title: 'Cases allocated in last 7 days | Manage a workforce',
      pduCode,
      pduDetails,
      casesLength: 0,
      allocatedCasesCount: caseAllocationDetails.length,
      allocatedCases: caseAllocationDetails,
      lastUpdatedOn: new Date(),
    })
  }
}
