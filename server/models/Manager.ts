import Name from './Name'

export default interface Manager {
  code: string
  name: Name
  teamCode: string
  grade: string
  allocated: boolean
}
