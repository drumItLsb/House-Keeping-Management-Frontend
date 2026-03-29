import { createSlice } from "@reduxjs/toolkit";

import { logoutThunk } from "../Login/LoginThunk";
import {
  clockingInThunk,
  clockingOutThunk,
} from "./AttendanceThunk";

type AttendanceStatus = "idle" | "loading" | "succeeded" | "failed";

type AttendanceState = {
  attendanceId: number | null;
  availability: string | null;
  clockInTime: string | null;
  clockOutTime: string | null;
  earlyExit: boolean | null;
  error: string | null;
  status: AttendanceStatus;
  workedHours: string | null;
};

const initialState: AttendanceState = {
  attendanceId: null,
  availability: null,
  clockInTime: null,
  clockOutTime: null,
  earlyExit: null,
  error: null,
  status: "idle",
  workedHours: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clockingInThunk.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(clockingInThunk.fulfilled, (state, action) => {
        state.attendanceId = action.payload.attendanceId;
        state.availability = action.payload.availability;
        state.clockInTime = action.payload.clockIn;
        state.clockOutTime = null;
        state.earlyExit = null;
        state.error = null;
        state.status = "succeeded";
        state.workedHours = null;
      })
      .addCase(clockingInThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to clock in right now.";
        state.status = "failed";
      })
      .addCase(clockingOutThunk.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(clockingOutThunk.fulfilled, (state, action) => {
        state.attendanceId = action.payload.id;
        state.clockInTime = action.payload.clockIn ?? state.clockInTime;
        state.clockOutTime = action.payload.clockOut;
        state.earlyExit = action.payload.earlyExit;
        state.error = null;
        state.status = "succeeded";
        state.workedHours = action.payload.workedHours;
      })
      .addCase(clockingOutThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to clock out right now.";
        state.status = "failed";
      })
      .addCase(logoutThunk.fulfilled, () => initialState);
  },
});

export default attendanceSlice.reducer;
