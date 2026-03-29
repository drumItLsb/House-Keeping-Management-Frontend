import { createSlice } from "@reduxjs/toolkit";

import {
  assignmentMappingThunk,
  assignmentSummaryThunk,
  shortfallThunk,
  type AssignmentMappingItem,
  type AssignmentSummaryResponse,
  type ShortfallResponse,
} from "./DashboardThunk";

type DashboardStatus = "idle" | "loading" | "succeeded" | "failed";

type DashboardState = {
  assignmentMapping: AssignmentMappingItem[];
  assignmentMappingError: string | null;
  assignmentMappingStatus: DashboardStatus;
  assignmentSummary: AssignmentSummaryResponse | null;
  assignmentSummaryError: string | null;
  assignmentSummaryStatus: DashboardStatus;
  shortfall: ShortfallResponse | null;
  shortfallError: string | null;
  shortfallStatus: DashboardStatus;
};

const initialState: DashboardState = {
  assignmentMapping: [],
  assignmentMappingError: null,
  assignmentMappingStatus: "idle",
  assignmentSummary: null,
  assignmentSummaryError: null,
  assignmentSummaryStatus: "idle",
  shortfall: null,
  shortfallError: null,
  shortfallStatus: "idle",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignmentSummaryThunk.pending, (state) => {
        state.assignmentSummaryError = null;
        state.assignmentSummaryStatus = "loading";
      })
      .addCase(assignmentSummaryThunk.fulfilled, (state, action) => {
        state.assignmentSummary = action.payload;
        state.assignmentSummaryError = null;
        state.assignmentSummaryStatus = "succeeded";
      })
      .addCase(assignmentSummaryThunk.rejected, (state, action) => {
        state.assignmentSummary = null;
        state.assignmentSummaryError =
          action.payload ?? "Unable to load assignment summary.";
        state.assignmentSummaryStatus = "failed";
      })
      .addCase(assignmentMappingThunk.pending, (state) => {
        state.assignmentMappingError = null;
        state.assignmentMappingStatus = "loading";
      })
      .addCase(assignmentMappingThunk.fulfilled, (state, action) => {
        state.assignmentMapping = action.payload;
        state.assignmentMappingError = null;
        state.assignmentMappingStatus = "succeeded";
      })
      .addCase(assignmentMappingThunk.rejected, (state, action) => {
        state.assignmentMapping = [];
        state.assignmentMappingError =
          action.payload ?? "Unable to load assignment mapping.";
        state.assignmentMappingStatus = "failed";
      })
      .addCase(shortfallThunk.pending, (state) => {
        state.shortfallError = null;
        state.shortfallStatus = "loading";
      })
      .addCase(shortfallThunk.fulfilled, (state, action) => {
        state.shortfall = action.payload;
        state.shortfallError = null;
        state.shortfallStatus = "succeeded";
      })
      .addCase(shortfallThunk.rejected, (state, action) => {
        state.shortfall = null;
        state.shortfallError =
          action.payload ?? "Unable to load shortfall indicator.";
        state.shortfallStatus = "failed";
      });
  },
});

export default dashboardSlice.reducer;
