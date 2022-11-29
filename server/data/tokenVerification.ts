import type { Request } from 'express'
import config from '../config'
import logger from '../../logger'
import RestClient from './restClient'
import TokenVerifyResponse from '../models/TokenVerifyResponse'

async function getApiClientToken(token: string) {
  try {
    const { active } = (await new RestClient(
      'Token Verification API Client',
      config.apis.tokenVerification,
      token
    ).post({
      path: '/token/verify',
    })) as TokenVerifyResponse

    return active
  } catch (error) {
    return false
  }
}

export type TokenVerifier = (request: Request) => Promise<boolean | void>

const tokenVerifier: TokenVerifier = async request => {
  const { user, verified } = request

  if (!config.apis.tokenVerification.enabled) {
    logger.debug('Token verification disabled, returning token is valid')
    return true
  }

  if (verified) {
    return true
  }

  logger.debug(`token request for user "${user.username}'`)

  const result = await getApiClientToken(user.token)
  if (result) {
    request.verified = true
  }
  return result
}

export default tokenVerifier
