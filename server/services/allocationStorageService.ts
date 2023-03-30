import type { DecisionEvidenceForm } from 'forms'
import { createRedisClient, RedisClient } from '../data/redisClient'

const EVIDENCE_TEXT_ID = 'evidenceText'
const IS_SENSITIVE_ID = 'isSensitive'
export default class AllocationStorageService {
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
      String(decisionEvidenceForm.isSensitive)
    )
    await this.redisClient.quit()
  }

  async setOrDelete(id, value: string) {
    if (value) {
      await this.redisClient.set(id, value, { PXAT: this.getPlusOneMonthTime() })
    } else {
      await this.redisClient.del(id)
    }
  }

  getPlusOneMonthTime(): number {
    const currentDate = new Date()
    const futureDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
    return futureDate.getTime()
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
    return isDefined(evidenceText) || isDefined(isSensitive)
      ? { evidenceText, isSensitive: toBoolean(isSensitive) }
      : undefined
  }

  generateCaseId(loggedInUser, crn, staffTeamCode, staffCode, convictionNumber, field): string {
    return `${loggedInUser}-${crn}-${convictionNumber}-${staffTeamCode}-${staffCode}-${field}`
  }
}

function isDefined(value) {
  return value !== null && value !== undefined
}

function toBoolean(value?: string): boolean | undefined {
  if (!value) {
    return undefined
  }

  switch (value.toLocaleLowerCase()) {
    case 'true':
    case '1':
    case 'on':
    case 'yes':
      return true
    default:
      return false
  }
}
