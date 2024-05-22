import { Request, Response } from 'express'

import WorkloadService from '../services/workloadService'
import AllocationCompleteDetails from '../models/AllocationCompleteDetails'

interface InitialAppointmentDateDisplayResult {
  showDisplayContentForInitialAppointmentDateAndStaff: boolean
  showDisplayContentForNoInitialAppointmentDate: boolean
}

export default class WorkloadController {
  constructor(private readonly workloadService: WorkloadService) {}

  getInitialAppointmentDateDisplayResult(
    allocationCompleteDetails: AllocationCompleteDetails
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
    const allocationCompleteDetails = await this.workloadService.getAllocationCompleteDetails(
      res.locals.user.token,
      crn,
      convictionNumber
    )

    const { otherEmails, sendEmailCopyToAllocatingOfficer } = req.session.allocationForm || {
      otherEmails: [],
      sendEmailCopyToAllocatingOfficer: false,
    }
    delete req.session.allocationForm

    return res.render('pages/allocation-complete', {
      title: `${allocationCompleteDetails.name.combinedName} | Case allocated | Manage a workforce`,
      pageUrl: `${req.headers.host}${req.url}`,
      data: allocationCompleteDetails,
      crn,
      convictionNumber,
      otherEmails,
      pduCode,
      sendEmailCopyToAllocatingOfficer,
      initialAppointmentDateDisplayResult: this.getInitialAppointmentDateDisplayResult(allocationCompleteDetails),
    })
  }
}
