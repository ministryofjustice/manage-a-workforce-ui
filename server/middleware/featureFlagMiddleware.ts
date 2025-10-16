import { Request, Response, NextFunction } from 'express'
import FeatureFlagService from '../services/featureFlagService'

const featureFlagService = new FeatureFlagService()

export async function featureFlagMiddleware(req: Request, res: Response, next: NextFunction) {
  const flag = await featureFlagService.getCachedFeatureflag('Reallocations', 'Reallocations')
  res.locals.featureFlag = flag
  next()
}

export default featureFlagMiddleware
