import dayjs from 'dayjs'

import config from '../../config'
import OffenderManagerOverview from '../../models/OffenderManagerOverview'
import CaseTotals from '../../models/CaseTotals'
import LastAllocatedEvent from '../../models/LastAllocatedEvent'

export default class OfficerView {
  forename: string

  surname: string

  grade: string

  capacity: number

  code: string

  totalCases: number

  weeklyHours: number

  pointsAvailable: number

  pointsUsed: number

  pointsRemaining: number

  lastUpdatedOn: string

  caseTotals: CaseTotals

  paroleReportsDue: number

  caseEndDue: number

  releasesDue: number

  reductions: string

  lastCaseAllocated: string

  email: string

  constructor(offenderManagerOverview: OffenderManagerOverview) {
    this.forename = offenderManagerOverview.forename
    this.surname = offenderManagerOverview.surname
    this.email = offenderManagerOverview.email
    this.grade = offenderManagerOverview.grade
    this.capacity = offenderManagerOverview.capacity
    this.code = offenderManagerOverview.code
    this.totalCases = offenderManagerOverview.totalCases
    this.weeklyHours = offenderManagerOverview.weeklyHours

    this.pointsAvailable = offenderManagerOverview.pointsAvailable
    this.pointsUsed = offenderManagerOverview.pointsUsed
    this.pointsRemaining = offenderManagerOverview.pointsRemaining
    this.lastUpdatedOn = offenderManagerOverview.lastUpdatedOn

    this.caseTotals = offenderManagerOverview.caseTotals
    this.paroleReportsDue = offenderManagerOverview.paroleReportsDue
    this.caseEndDue = offenderManagerOverview.caseEndDue
    this.releasesDue = offenderManagerOverview.releasesDue
    this.lastCaseAllocated = this.getLastCaseAllocated(offenderManagerOverview.lastAllocatedEvent)
    this.reductions = this.getReductions(
      offenderManagerOverview.totalReductionHours,
      offenderManagerOverview.nextReductionChange,
    )
  }

  getLastCaseAllocated(lastAllocatedEvent: LastAllocatedEvent): string {
    if (lastAllocatedEvent) {
      return `${dayjs(lastAllocatedEvent.allocatedOn).format(config.dateFormat)} (Tier ${
        lastAllocatedEvent.tier
      }, in ${this.getCaseText(lastAllocatedEvent.sentenceType)})`
    }
    return ''
  }

  getCaseText(caseType: string): string {
    if (caseType === 'COMMUNITY') {
      return 'community'
    }
    return 'custody'
  }

  getReductions(totalReductionHours: number, nextReductionChange: string): string {
    return `${totalReductionHours}${this.getReductionUntil(nextReductionChange)} `
  }

  getReductionUntil(nextReductionChange: string): string {
    if (nextReductionChange) {
      return ` hours until ${dayjs(nextReductionChange).format(config.dateFormat)}`
    }
    return ''
  }
}
