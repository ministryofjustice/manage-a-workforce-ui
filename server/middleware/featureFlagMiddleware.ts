import { Request, Response, NextFunction } from 'express'
import FeatureFlagService from '../services/featureFlagService'
import logger from '../../logger'

const featureFlagService = new FeatureFlagService()

export default function featureFlagMiddleware(services, flagKey, flagName) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, username } = res.locals.user
      const { items: pduSelection } = await services.userPreferenceService.getPduUserPreference(token, username)
      const [pduCode] = pduSelection

      const pduDetails = await services.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode)

      await services.allocationsService.getUserRegionAccessForRegion(
        res.locals.user.token,
        res.locals.user.username,
        pduDetails.region.code,
      )

      const flag = await featureFlagService.isFeatureEnabled(flagKey, flagName, {
        regionCode: pduDetails.region.code,
      })

      res.locals.featureFlags = {
        ...res.locals.featureFlags,
        [flagKey]: flag,
      }
    } catch (error) {
      res.locals.featureFlags = {
        ...res.locals.featureFlags,
        [flagKey]: null,
      }

      logger.error(`Error fetching feature flag ${flagKey}`, error)
    }
    next()
  }
}
