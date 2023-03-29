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
    await this.redisClient.connect()
    await this.setOrDelete(
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, 'evidenceText'),
      decisionEvidenceForm.evidenceText
    )
    await this.setOrDelete(
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, 'isSensitive'),
      decisionEvidenceForm.isSensitive
    )
    await this.redisClient.quit()
  }

  async setOrDelete(id, value) {
    if (value) {
      await this.redisClient.set(id, value)
    } else {
      await this.redisClient.del(id)
    }
  }

  async getDecisionEvidence(
    loggedInUser,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber
  ): Promise<DecisionEvidenceForm> {
    await this.redisClient.connect()
    const evidenceText = await this.redisClient.get(
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, 'evidenceText')
    )
    const isSensitive = await this.redisClient.get(
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, 'isSensitive')
    )
    await this.redisClient.quit()
    return { evidenceText, isSensitive }
  }

  generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, field): string {
    return `${loggedInUser}-${crn}-${convictionNumber}-${staffTeamCode}-${staffCode}-${field}`
  }
}
