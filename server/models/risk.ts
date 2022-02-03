import Registration from './registration'

export default interface Risk {
  name: string
  crn: string
  tier: string
  active: Registration[]
  previous: Registration[]
}
