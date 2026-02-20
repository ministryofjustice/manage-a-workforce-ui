import Flag from './Flag'

type Registration =
  | {
      type: string
      registered: string
      notes: string
      nextReviewDate?: string
      flag: Flag
    }
  | {
      type: string
      registered: string
      notes: string
      endDate: string
      flag: Flag
    }

export default Registration
