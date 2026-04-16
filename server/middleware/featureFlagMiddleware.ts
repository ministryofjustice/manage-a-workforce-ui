import { Request, Response, NextFunction } from 'express'
import FeatureFlagService from '../services/featureFlagService'
import logger from '../../logger'

const featureFlagService = new FeatureFlagService()

export default function featureFlagMiddleware(services) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, username } = res.locals.user
      const { items: pduSelection } = await services.userPreferenceService.getPduUserPreference(token, username)
      const [pduCode] = pduSelection

      const pduDetails = await services.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode)

      const regionCode = pduDetails.region.code

      await services.allocationsService.getUserRegionAccessForRegion(token, username, regionCode)

      const [reallocations, enableEmailList] = await Promise.all([
        featureFlagService.isFeatureEnabled(regionCode, 'Reallocations', { regionCode }),
        featureFlagService.isFeatureEnabled(regionCode, 'enableEmailList', { regionCode }),
      ])

      res.locals.featureFlags = {
        ...res.locals.featureFlags,
        Reallocations: reallocations,
        enableEmailList,
      }
      next()
    } catch (error) {
      logger.error(error, 'Error fetching feature flags')

      res.locals.featureFlags = {
        ...res.locals.featureFlags,
        reallocations: false,
        email: false,
      }
      next()
    }
  }
}
