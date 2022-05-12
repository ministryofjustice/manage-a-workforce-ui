import allocation from '../../models/Allocation'
import AllocationsService from '../../services/allocationsService'
import sanitisedError, { UnsanitisedError } from '../../sanitisedError'

export default class MockErrorAllocationService extends AllocationsService {
  getUnallocatedCases(_token: string): Promise<allocation[]> {
    const error = {
      message: 'error description',
      status: 500,
    } as unknown as UnsanitisedError
    throw sanitisedError(error)
  }
}
