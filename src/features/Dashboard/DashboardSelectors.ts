import type { RootState } from "../../app/Store";

export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectAssignmentSummary = (state: RootState) =>
  state.dashboard.assignmentSummary;
export const selectAssignmentSummaryError = (state: RootState) =>
  state.dashboard.assignmentSummaryError;
export const selectAssignmentSummaryStatus = (state: RootState) =>
  state.dashboard.assignmentSummaryStatus;
export const selectAssignmentMapping = (state: RootState) =>
  state.dashboard.assignmentMapping;
export const selectAssignmentMappingError = (state: RootState) =>
  state.dashboard.assignmentMappingError;
export const selectAssignmentMappingStatus = (state: RootState) =>
  state.dashboard.assignmentMappingStatus;
export const selectShortfall = (state: RootState) => state.dashboard.shortfall;
export const selectShortfallError = (state: RootState) =>
  state.dashboard.shortfallError;
export const selectShortfallStatus = (state: RootState) =>
  state.dashboard.shortfallStatus;
