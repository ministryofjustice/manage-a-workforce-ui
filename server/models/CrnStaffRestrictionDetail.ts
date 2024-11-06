import Offence from './Offence'
import Requirement from './Requirement'
import Document from './Document'
import Assessment from './Assessment'
import Address from './Address'

export default interface CrnStaffRestrictionDetail {
  staffCode: string
  isExcluded: boolean
}
