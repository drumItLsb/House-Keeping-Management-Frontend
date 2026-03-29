import { createSlice } from '@reduxjs/toolkit';

import {
  beginTask,
  completeTask,
  fetchStaffAssignmentsThunk,
  leaveThunk,
  type LeaveResponse,
  type StaffAssignment,
} from './StaffThunk';

type StaffStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type StaffState = {
  assignments: StaffAssignment[];
  error: string | null;
  leaveApplication: LeaveResponse | null;
  leaveError: string | null;
  leaveStatus: StaffStatus;
  status: StaffStatus;
};

const initialState: StaffState = {
  assignments: [],
  error: null,
  leaveApplication: null,
  leaveError: null,
  leaveStatus: 'idle',
  status: 'idle',
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffAssignmentsThunk.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchStaffAssignmentsThunk.fulfilled, (state, action) => {
        state.assignments = action.payload;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(fetchStaffAssignmentsThunk.rejected, (state, action) => {
        state.assignments = [];
        state.error = action.payload ?? 'Unable to fetch staff assignments.';
        state.status = 'failed';
      })
      .addCase(beginTask.pending, (state) => {
        state.error = null;
      })
      .addCase(beginTask.fulfilled, (state, action) => {
        state.assignments = state.assignments.map((assignment) =>
          assignment.taskId === action.payload.taskId
            ? { ...assignment, status: action.payload.status }
            : assignment,
        );
        state.error = null;
      })
      .addCase(beginTask.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to begin the selected task.';
      })
      .addCase(completeTask.pending, (state) => {
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.assignments = state.assignments.map((assignment) =>
          assignment.taskId === action.payload.taskId
            ? { ...assignment, status: action.payload.status }
            : assignment,
        );
        state.error = null;
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to complete the selected task.';
      })
      .addCase(leaveThunk.pending, (state) => {
        state.leaveError = null;
        state.leaveStatus = 'loading';
      })
      .addCase(leaveThunk.fulfilled, (state, action) => {
        state.leaveApplication = action.payload;
        state.leaveError = null;
        state.leaveStatus = 'succeeded';
      })
      .addCase(leaveThunk.rejected, (state, action) => {
        state.leaveError = action.payload ?? 'Unable to apply for leave right now.';
        state.leaveStatus = 'failed';
      });
  },
});

export default staffSlice.reducer;
