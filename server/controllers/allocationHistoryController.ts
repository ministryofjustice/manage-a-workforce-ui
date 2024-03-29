import { Request, Response } from 'express'
import WorkloadService from '../services/workloadService'
import ProbationEstateService from '../services/probationEstateService'
import config from '../config'

export default class AllocationHistoryController {
  constructor(
    private readonly workloadService: WorkloadService,
    private readonly probationEstateService: ProbationEstateService
  ) {}

  async getCasesAllocated(req: Request, res: Response, pduCode): Promise<void> {
    const { token } = res.locals.user

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
      title: 'Cases allocated in last 30 days | Manage a workforce',
      pduCode,
      pduDetails,
      casesLength: 0,
      allocatedCasesCount: caseAllocationDetails.length,
      allocatedCases: caseAllocationDetails,
      lastUpdatedOn: new Date(),
    })
  }
}
