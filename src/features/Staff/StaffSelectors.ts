import type { RootState } from '../../app/Store';

export const selectStaffAssignmentsState = (state: RootState) => state.staff;
export const selectStaffAssignments = (state: RootState) => state.staff.assignments;
export const selectStaffAssignmentsStatus = (state: RootState) => state.staff.status;
export const selectStaffAssignmentsError = (state: RootState) => state.staff.error;
