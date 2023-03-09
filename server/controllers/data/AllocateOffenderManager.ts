export const gradeTips: Map<string, string> = new Map()
gradeTips.set('PO', 'probation officer')
gradeTips.set('NQO', 'newly qualified officer')
gradeTips.set('PQiP', 'trainee probation officer')
gradeTips.set('PSO', 'probation service officer')
gradeTips.set('SPO', 'senior probation officer')
gradeTips.set('DMY', 'No Grade')

export const gradeOrder: Map<string, number> = new Map()
gradeOrder.set('PO', 3)
gradeOrder.set('PSO', 2)
gradeOrder.set('PQiP', 1)

export default class AllocateOffenderManager {
  name: string

  grade: string

  gradeTip: string

  gradeOrder: number

  capacity: number

  communityCases: number

  custodyCases: number

  code: string

  totalCasesInLastWeek: number

  email: string

  constructor(
    forename: string,
    surname: string,
    grade: string,
    capacity: number,
    communityCases: number,
    custodyCases: number,
    code: string,
    totalCasesInLastWeek: number,
    email: string
  ) {
    this.name = `${forename} ${surname}`
    this.grade = grade
    this.gradeTip = gradeTips.get(grade)
    this.gradeOrder = gradeOrder.get(grade) || 0
    this.capacity = capacity
    this.communityCases = communityCases
    this.custodyCases = custodyCases
    this.code = code
    this.totalCasesInLastWeek = totalCasesInLastWeek
    this.email = email
  }
}
