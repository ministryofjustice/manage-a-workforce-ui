import { resetStubs } from '../mockServices/allocation-wiremock'
import { resetWorkloadStubs } from '../mockServices/workload-wiremock'

import auth from '../mockCalls/auth'
import tokenVerification from '../mockCalls/tokenVerification'
import allocations from '../mockCalls/allocations'
import probationRecord from '../mockCalls/probationRecord'
import risk from '../mockCalls/risk'
import allocateOffenderManagers from '../mockCalls/allocateOffenderManagers'
import allocationConfirm from '../mockCalls/allocationConfirm'
import overview from '../mockCalls/overview'
import allocationCase from '../mockCalls/allocationCase'
import offenderManagerCases from '../mockCalls/offenderManagerCases'
import staff from '../mockCalls/staff'
import allocationComplete from '../mockCalls/allocationComplete'
import person from '../mockCalls/person'

export default (on: (string, Record) => void): void => {
  on('task', {
    reset: () => resetStubs().then(() => resetWorkloadStubs()),

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

    stubGetCurrentlyManagedCaseOverview: allocationCase.stubGetCurrentlyManagedCaseOverview,

    stubGetCurrentlyManagedNoOffenderManagerCaseOverview:
      allocationCase.stubGetCurrentlyManagedNoOffenderManagerCaseOverview,

    stubGetPreviouslyManagedCaseOverview: allocationCase.stubGetPreviouslyManagedCaseOverview,

    stubGetNewToProbationCaseOverview: allocationCase.stubGetNewToProbationCaseOverview,

    stubGetPotentialOffenderManagerWorkload: allocationConfirm.stubGetPotentialOffenderManagerWorkload,

    stubGetPotentialOffenderManagerWorkloadOverCapacity:
      allocationConfirm.stubGetPotentialOffenderManagerWorkloadOverCapacity,

    stubGetOverview: overview.stubGetOverview,

    stubGetOverviewUnderCapacity: overview.stubGetOverviewUnderCapacity,

    stubGetOffenderManagerCases: offenderManagerCases.stubGetOffenderManagerCases,

    stubGetStaffByCode: staff.stubGetStaffByCode,

    stubAllocateOffenderManagerToCase: allocationComplete.stubAllocateOffenderManagerToCase,

    stubAllocateOffenderManagerToCaseMultipleEmails: allocationComplete.stubAllocateOffenderManagerToCaseMultipleEmails,

    stubGetPersonById: person.stubGetPersonById,

    stubGetCaseOverviewNoInitialAppointment: allocationCase.stubGetCaseOverviewNoInitialAppointment,

    stubGetCaseOverviewCustodyCase: allocationCase.stubGetCaseOverviewCustodyCase,
  })
}
