import { createSlice } from '@reduxjs/toolkit';

import {
  beginTask,
  completeTask,
  fetchStaffAssignmentsThunk,
  type StaffAssignment,
} from './StaffThunk';

type StaffStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type StaffState = {
  assignments: StaffAssignment[];
  error: string | null;
  status: StaffStatus;
};

const initialState: StaffState = {
  assignments: [],
  error: null,
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
      });
  },
});

export default staffSlice.reducer;
