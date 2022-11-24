import { Request, Response, NextFunction } from 'express'
import { HTTPError } from 'superagent'
import WorkloadService from '../services/workloadService'

export default function checkCaseAlreadyAllocated(workloadService: WorkloadService) {
  return async (error: HTTPError, req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (error.status === 404) {
      try {
        const { crn, convictionId, teamCode } = req.params
        const eventManagerDetails = await workloadService.getEventManagerDetails(res.locals.user.token, convictionId)
        return res.status(error.status).render('pages/case-already-allocated', {
          title: 'Case unavailable | Manage a workforce',
          crn,
          tier: eventManagerDetails.tier,
          name: `${eventManagerDetails.personOnProbationFirstName} ${eventManagerDetails.personOnProbationSurname}`,
          teamCode,
        })
      } catch (callError) {
        return next(callError)
      }
    }
    return next(error)
  }
}
