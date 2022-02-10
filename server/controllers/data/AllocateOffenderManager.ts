const gradeTips: Map<string, string> = new Map()
gradeTips.set('PO', 'Probation Officer')
gradeTips.set('NQO', 'Newly Qualified Officer')
gradeTips.set('PQiP', 'Trainee Probation Officer')
gradeTips.set('PSO', 'Probation Service Officer')
gradeTips.set('SPO', 'Senior Probation Officer')
gradeTips.set('DMY', 'No Grade')

export default class AllocateOffenderManager {
  name: string

  grade: string

  gradeTip: string

  capacity: number

  communityCases: number

  custodyCases: number

  constructor(
    forename: string,
    surname: string,
    grade: string,
    capacity: number,
    communityCases: number,
    custodyCases: number
  ) {
    this.name = `${forename} ${surname}`
    this.grade = grade
    this.gradeTip = gradeTips.get(grade)
    this.capacity = capacity
    this.communityCases = communityCases
    this.custodyCases = custodyCases
  }
}
