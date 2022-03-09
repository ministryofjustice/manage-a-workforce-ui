import { resetStubs } from '../mockApis/wiremock'

import auth from '../mockApis/auth'
import tokenVerification from '../mockApis/tokenVerification'
import allocations from '../mockApis/allocations'
import probationRecord from '../mockApis/probationRecord'
import risk from '../mockApis/risk'
import allocateOffenderManagers from '../mockApis/allocateOffenderManagers'
import allocationConfirm from '../mockApis/allocationConfirm'
import workloadDetails from '../mockApis/overview'

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

    stubGetUnallocatedCaseMultiOffences: allocations.stubGetUnallocatedCaseMultiOffences,

    stubGetProbationRecord: probationRecord.stubGetProbationRecord,

    stubGetProbationRecordNoConvictions: probationRecord.stubGetProbationRecordNoConvictions,

    stubGetProbationRecordMultipleOffences: probationRecord.stubGetProbationRecordMultipleOffences,

    stubGetManyPreviousProbationRecord: probationRecord.stubGetManyPreviousProbationRecord,

    stubGetRisk: risk.stubGetRisk,

    stubGetRiskNoRegistrations: risk.stubGetRiskNoRegistrations,

    stubGetUnallocatedCasePreviouslyManaged: allocations.stubGetUnallocatedCasePreviouslyManaged,

    stubGetUnallocatedCaseNewToProbation: allocations.stubGetUnallocatedCaseNewToProbation,

    stubGetUnallocatedCaseNoOffenderManager: allocations.stubGetUnallocatedCaseNoOffenderManager,

    stubGetAllocateOffenderManagers: allocateOffenderManagers.stubGetAllocateOffenderManagers,

    stubGetAllocateOffenderManagersNoOffenderManager:
      allocateOffenderManagers.stubGetAllocateOffenderManagersNoOffenderManager,

    stubGetAllocateOffenderManagersPreviouslyManaged:
      allocateOffenderManagers.stubGetAllocateOffenderManagersPreviouslyManaged,

    stubGetAllocateOffenderManagersNewToProbation:
      allocateOffenderManagers.stubGetAllocateOffenderManagersNewToProbation,

    stubGetPotentialOffenderManagerWorkload: allocationConfirm.stubGetPotentialOffenderManagerWorkload,

    stubGetPotentialOffenderManagerWorkloadOverCapacity:
      allocationConfirm.stubGetPotentialOffenderManagerWorkloadOverCapacity,

    stubGetOverview: workloadDetails.stubGetOverview,
  })
}
