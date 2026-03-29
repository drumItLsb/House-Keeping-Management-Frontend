import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/Store";
import apiClient from "../../service/apiClient";

export type StaffAssignment = {
  assignedAt: string;
  durationMinutes: number;
  roomId: number;
  shift: string;
  staffId: number;
  status: string;
  taskId: number;
  taskType: string;
};

const formatCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isCancel(error)) {
    return "The request was cancelled.";
  }

  if (axios.isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message;

    return responseMessage || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const fetchStaffAssignmentsThunk = createAsyncThunk<
  StaffAssignment[],
  void,
  { rejectValue: string; state: RootState }
>("staff/fetchAssignments", async (_, thunkApi) => {
  const state = thunkApi.getState();
  const { propertyId, shift, staffId } = state.login;

  if (!propertyId || !shift || !staffId) {
    return thunkApi.rejectWithValue(
      "Missing staff assignment context for the logged in user.",
    );
  }

  try {
    const response = await apiClient.get<StaffAssignment[]>(
      "/staff/assignments",
      {
        params: {
          date: formatCurrentDate(),
          property_id: propertyId,
          shift,
          staff_id: staffId,
        },
        signal: thunkApi.signal,
      },
    );

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to fetch staff assignments."),
    );
  }
});
