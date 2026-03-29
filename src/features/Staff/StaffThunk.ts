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

export type BeginTaskResponse = {
  message: string;
  status: string;
  taskId: number;
};

export type CompleteTaskResponse = {
  message: string;
  status: string;
  taskId: number;
};

const formatCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatLocalDateTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
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

export const beginTask = createAsyncThunk<
  BeginTaskResponse,
  { taskId: number },
  { rejectValue: string; state: RootState }
>("staff/beginTask", async ({ taskId }, thunkApi) => {
  try {
    const response = await apiClient.put<BeginTaskResponse>(
      "/staff/task/begin",
      {
        startTime: formatLocalDateTime(),
        taskId,
      },
      {
        signal: thunkApi.signal,
      },
    );

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to begin the selected task."),
    );
  }
});

export const completeTask = createAsyncThunk<
  CompleteTaskResponse,
  { taskId: number },
  { rejectValue: string; state: RootState }
>("staff/completeTask", async ({ taskId }, thunkApi) => {
  try {
    const response = await apiClient.put<CompleteTaskResponse>(
      "/staff/task/complete",
      {
        completedTime: formatLocalDateTime(),
        taskId,
      },
      {
        signal: thunkApi.signal,
      },
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to complete the selected task."),
    );
  }
});
