import type { DecisionEvidenceForm } from 'forms'
import { createRedisClient, RedisClient } from '../data/redisClient'

const EVIDENCE_TEXT_ID = 'evidenceText'
const IS_SENSITIVE_ID = 'isSensitive'
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30
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
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, EVIDENCE_TEXT_ID),
      decisionEvidenceForm.evidenceText
    )
    await this.setOrDelete(
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, IS_SENSITIVE_ID),
      decisionEvidenceForm.isSensitive
    )
    await this.redisClient.quit()
  }

  async setOrDelete(id, value) {
    if (value) {
      await this.redisClient.set(id, value, { EX: THIRTY_DAYS_IN_SECONDS })
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
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, EVIDENCE_TEXT_ID)
    )
    const isSensitive = await this.redisClient.get(
      this.generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, IS_SENSITIVE_ID)
    )
    await this.redisClient.quit()
    return { evidenceText, isSensitive }
  }

  generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, field): string {
    return `${loggedInUser}-${crn}-${convictionNumber}-${staffTeamCode}-${staffCode}-${field}`
  }
}
