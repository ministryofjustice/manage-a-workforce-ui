import Registration from './Registration'

export default interface Risk {
  name: string
  crn: string
  tier: string
  active: Registration[]
  previous: Registration[]
  convictionId: number
}
