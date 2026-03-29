import type { RootState } from "../../app/Store";

export const selectAttendanceState = (state: RootState) => state.attendance;
export const selectAttendanceStatus = (state: RootState) =>
  state.attendance.status;
export const selectAttendanceError = (state: RootState) => state.attendance.error;
export const selectClockInTime = (state: RootState) => state.attendance.clockInTime;
export const selectClockOutTime = (state: RootState) =>
  state.attendance.clockOutTime;
export const selectWorkedHours = (state: RootState) =>
  state.attendance.workedHours;
export const selectEarlyExit = (state: RootState) => state.attendance.earlyExit;
export const selectIsClockedIn = (state: RootState) =>
  Boolean(state.attendance.clockInTime) && !state.attendance.clockOutTime;
