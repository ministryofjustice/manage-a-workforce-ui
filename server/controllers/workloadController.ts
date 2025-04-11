import { Request, Response } from 'express'

import WorkloadService from '../services/workloadService'
import AllocationCompleteDetails from '../models/AllocationCompleteDetails'
import { unescapeApostrophe } from '../utils/utils'
import AllocationsService from '../services/allocationsService'

interface InitialAppointmentDateDisplayResult {
  showDisplayContentForInitialAppointmentDateAndStaff: boolean
  showDisplayContentForNoInitialAppointmentDate: boolean
}

export default class WorkloadController {
  constructor(
    private readonly workloadService: WorkloadService,
    private readonly allocationService: AllocationsService,
  ) {}

  getInitialAppointmentDateDisplayResult(
    allocationCompleteDetails: AllocationCompleteDetails,
  ): InitialAppointmentDateDisplayResult {
    if (allocationCompleteDetails.type === 'COMMUNITY') {
      if (
        allocationCompleteDetails.initialAppointment !== undefined &&
        allocationCompleteDetails.initialAppointment.date !== undefined
      ) {
        return {
          showDisplayContentForInitialAppointmentDateAndStaff: true,
          showDisplayContentForNoInitialAppointmentDate: false,
        }
      }
      return {
        showDisplayContentForInitialAppointmentDateAndStaff: false,
        showDisplayContentForNoInitialAppointmentDate: true,
      }
    }
    return {
      showDisplayContentForInitialAppointmentDateAndStaff: false,
      showDisplayContentForNoInitialAppointmentDate: false,
    }
  }

  async allocationComplete(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const [allocationCompleteDetails, laoRestricted] = await Promise.all([
      await this.workloadService.getAllocationCompleteDetails(res.locals.user.token, crn, convictionNumber),
      await this.allocationService.getLaoStatus(crn, res.locals.user.token),
    ])

    const { otherEmails, sendEmailCopyToAllocatingOfficer } = req.session.allocationForm || {
      otherEmails: [],
      sendEmailCopyToAllocatingOfficer: false,
    }
    delete req.session.allocationForm
    allocationCompleteDetails.name.surname = unescapeApostrophe(allocationCompleteDetails.name.surname)
    allocationCompleteDetails.name.combinedName = unescapeApostrophe(allocationCompleteDetails.name.combinedName)
    return res.render('pages/allocation-complete', {
      title: `${allocationCompleteDetails.name.combinedName} | Case allocated | Manage a workforce`,
      data: allocationCompleteDetails,
      crn,
      convictionNumber,
      otherEmails,
      pduCode,
      sendEmailCopyToAllocatingOfficer,
      initialAppointmentDateDisplayResult: this.getInitialAppointmentDateDisplayResult(allocationCompleteDetails),
      laoRestricted,
    })
  }
}
