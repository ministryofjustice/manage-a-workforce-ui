import { resetStubs } from '../mockApis/wiremock'

import auth from '../mockApis/auth'
import tokenVerification from '../mockApis/tokenVerification'
import allocations from '../mockApis/allocations'

export default (on: (string, Record) => void): void => {
  on('task', {
    reset: resetStubs,

    getSignInUrl: auth.getSignInUrl,
    stubSignIn: auth.stubSignIn,

    stubAuthUser: auth.stubUser,
    stubAuthPing: auth.stubPing,

    stubTokenVerificationPing: tokenVerification.stubPing,

    stubGetAllocations: allocations.stubGetAllocations,

    stubGetNoAllocations: allocations.stubGetNoAllocations,

    stubOverOneHundredAllocations: allocations.stubOverOneHundredAllocations,

    stubGetUnallocatedCase: allocations.stubGetUnallocatedCase,
  })
}
