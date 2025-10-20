import { Request, Response, NextFunction } from 'express'
import FeatureFlagService from '../services/featureFlagService'
import logger from '../../logger'

const featureFlagService = new FeatureFlagService()

export default function featureFlagMiddleware(flagKey, flagName) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const flag = await featureFlagService.getCachedFeatureflag(flagKey, flagName)
      res.locals.featureFlag = flag
    } catch (error) {
      res.locals.featureFlag = null
      logger.error(`Error fetching feature flag ${flagKey}`, error)
    }
    next()
  }
}
