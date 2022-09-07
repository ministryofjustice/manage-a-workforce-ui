import { RequestHandler } from 'express'
import logger from '../../logger'
import UserPreferenceService from '../services/userPreferenceService'
import AllocationsService from '../services/allocationsService'

export default function getUnallocatedCasesCount(
  userPreferenceService: UserPreferenceService,
  allocationsService: AllocationsService
): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const { token, username } = res.locals.user
        const { items: teamSelection } = await userPreferenceService.getTeamsUserPreference(token, username)
        // backwards compatibility for current journey, once multiple teams released this should be removed
        if (!teamSelection.length) {
          teamSelection.push('N03F01')
        }
        const unallocatedCasesCountByTeams = await allocationsService.getCaseCountByTeamCodes(token, teamSelection)
        res.locals.unallocatedCaseCount = unallocatedCasesCountByTeams
          .map(teamCount => teamCount.caseCount)
          .reduce((first, second) => first + second, 0)
      }
      next()
    } catch (error) {
      logger.error(error, 'Failed to retrieve unallocated case count')
      next(error)
    }
  }
}
