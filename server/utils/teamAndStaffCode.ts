// eslint-disable-next-line import/prefer-default-export
export class TeamAndStaffCode {
  teamCode: string

  staffCode: string

  constructor(teamCode: string, staffCode: string) {
    this.teamCode = teamCode
    this.staffCode = staffCode
  }

  public static encode(teamCode: string, staffCode: string): string {
    return `${teamCode}::${staffCode}`
  }

  public static decode(encodedString: string): TeamAndStaffCode {
    const items = encodedString.split('::')
    if (items.length === 2) {
      return new TeamAndStaffCode(items[0], items[1])
    }
    return null
  }
}
