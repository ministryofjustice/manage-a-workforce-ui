import axios from 'axios'
import type { Request } from 'express'
import getSanitisedError from '../sanitisedError'
import config from '../config'
import logger from '../../logger'

async function getApiClientToken(token: string) {
  try {
    const { data } = await axios.post(`${config.apis.tokenVerification.url}/token/verify`, null, {
      headers: { 'Accept-Encoding': 'application/json', Authorization: `Bearer ${token}` },
      timeout: config.apis.tokenVerification.timeout.response,
    })
    return Boolean(data && data.active)
  } catch (error) {
    logger.error(getSanitisedError(error), 'Error calling tokenVerificationApi')
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
