import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/Store";
import apiClient from "../../service/apiClient";

export type AssignmentSummaryResponse = {
  date: string;
  roomSummary: {
    dailyClean: number;
    deepClean: number;
    occupied: number;
    vacant: number;
    vacantClean: number;
  };
  staffSummary: {
    onDuty: number;
    onLeave: number;
    sick: number;
  };
  taskSummary: {
    completed: number;
    inProgress: number;
    pending: number;
    reassigned: number;
  };
};

export type AssignmentMappingItem = {
  date: string;
  durationMinutes: number;
  roomId: number;
  shift: string;
  staffId: number;
  status: string;
  taskType: string;
};

export type ShortfallResponse = {
  date: string;
  extraStaffNeeded: number;
  resolved: boolean;
  shift: string;
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

export const assignmentSummaryThunk = createAsyncThunk<
  AssignmentSummaryResponse,
  void,
  { rejectValue: string; state: RootState }
>("dashboard/assignmentSummary", async (_, thunkApi) => {
  try {
    const response = await apiClient.get<AssignmentSummaryResponse>(
      "/admin/summary",
      {
        params: {
          date: formatCurrentDate(),
        },
        signal: thunkApi.signal,
      },
    );

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to load assignment summary."),
    );
  }
});

export const assignmentMappingThunk = createAsyncThunk<
  AssignmentMappingItem[],
  void,
  { rejectValue: string; state: RootState }
>("dashboard/assignmentMapping", async (_, thunkApi) => {
  const { propertyId } = thunkApi.getState().login;

  if (!propertyId) {
    return thunkApi.rejectWithValue(
      "Missing property context for the logged in administrator.",
    );
  }

  try {
    const [morningResponse, afternoonResponse] = await Promise.all([
      apiClient.get<AssignmentMappingItem[]>("/admin/assignment/mapping", {
        params: {
          date: formatCurrentDate(),
          propertyId,
          shift: "MORNING",
        },
        signal: thunkApi.signal,
      }),
      apiClient.get<AssignmentMappingItem[]>("/admin/assignment/mapping", {
        params: {
          date: formatCurrentDate(),
          propertyId,
          shift: "AFTERNOON",
        },
        signal: thunkApi.signal,
      }),
    ]);

    return [...morningResponse.data, ...afternoonResponse.data];
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to load assignment mapping."),
    );
  }
});

export const shortfallThunk = createAsyncThunk<
  ShortfallResponse,
  void,
  { rejectValue: string; state: RootState }
>("dashboard/shortfall", async (_, thunkApi) => {
  try {
    const response = await apiClient.get<ShortfallResponse>(
      "/admin/shortfall",
      {
        params: {
          date: formatCurrentDate(),
        },
        signal: thunkApi.signal,
      },
    );

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to load shortfall indicator."),
    );
  }
});
