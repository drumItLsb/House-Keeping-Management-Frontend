import { createSlice } from '@reduxjs/toolkit';

import { fetchStaffAssignmentsThunk, type StaffAssignment } from './StaffThunk';

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
      });
  },
});

export default staffSlice.reducer;
