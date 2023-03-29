// eslint-disable-next-line import/no-extraneous-dependencies
import { RedisJSON } from '@redis/json/dist/commands'
import type { DecisionEvidenceForm } from 'forms'
import { createRedisClient, RedisClient } from '../data/redisClient'

export default class CacheService {
  redisClient: RedisClient

  constructor() {
    this.redisClient = createRedisClient()
  }

  async saveDecisionEvidence(
    loggedInUser,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    decisionEvidenceForm: DecisionEvidenceForm
  ) {
    await this.redisClient.json.set(`${loggedInUser}-${crn}-${convictionNumber}-${staffTeamCode}-${staffCode}`, '$', {
      decisionEvidenceForm,
    } as unknown as RedisJSON)
  }

  async getDecisionEvidence(
    loggedInUser,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber
  ): Promise<DecisionEvidenceForm> {
    const forms = (await this.redisClient.json.get(
      `${loggedInUser}-${crn}-${convictionNumber}-${staffTeamCode}-${staffCode}`
    )) as unknown as Forms
    return forms.decisionEvidenceForm
  }
}

type Forms = {
  decisionEvidenceForm: DecisionEvidenceForm
}
