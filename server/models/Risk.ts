import Registration from './Registration'
import RoshRisk from './RoshRisk'

interface RiskCommon {
  name: string
  crn: string
  tier: string
  completedDate: string
  activeRegistrations: Registration[]
  inactiveRegistrations: Registration[]
  convictionNumber: string | number | null
  laoCase: boolean
}

interface RiskV1 extends RiskCommon {
  riskVersion: '1'
  risk: {
    roshRisk: RoshRisk
    groupReconvictionScore: {
      oneYear: number
      twoYears: number
      scoreLevel: string
    }
    riskOfSeriousRecidivismScore: {
      percentageScore: number
      staticOrDynamic: string
      source: string
      algorithmVersion: string
      scoreLevel: string
    }
  }
}

interface RiskV2 extends RiskCommon {
  riskVersion: '2'
  risk: {
    roshRisk: RoshRisk
    allReoffendingPredictor: {
      staticOrDynamic: string
      score: number
      band: string
    }
    combinedSeriousReoffendingPredictor: {
      algorithmVersion: string
      staticOrDynamic: string
      score: number
      band: string
    }
  }
}

type Risk = RiskV1 | RiskV2

export default Risk
