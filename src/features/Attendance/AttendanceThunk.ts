import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/Store";
import apiClient from "../../service/apiClient";

export type ClockInResponse = {
  attendanceId: number;
  availability: string;
  clockIn: string;
  shift: string;
  staffId: string;
};

export type ClockOutResponse = {
  clockIn: string;
  clockOut: string;
  earlyExit: boolean;
  id: number;
  staff_id: number;
  workedHours: string;
};

type ClockInPayload = {
  id: number;
  shift: string;
};

type ClockOutPayload = {
  date: string;
  shift: string;
  staff_id: number;
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

const getAttendanceContext = (state: RootState) => {
  const { shift, staffId } = state.login;

  if (!staffId || !shift) {
    return null;
  }

  return { shift, staffId };
};

export const clockingInThunk = createAsyncThunk<
  ClockInResponse,
  void,
  { rejectValue: string; state: RootState }
>("attendance/clockIn", async (_, thunkApi) => {
  const attendanceContext = getAttendanceContext(thunkApi.getState());

  if (!attendanceContext) {
    return thunkApi.rejectWithValue(
      "Missing attendance context for the logged in user.",
    );
  }

  const payload: ClockInPayload = {
    id: attendanceContext.staffId,
    shift: attendanceContext.shift,
  };

  try {
    const response = await apiClient.post<ClockInResponse>(
      "/attendance/clockin",
      payload,
      { signal: thunkApi.signal },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to clock in right now."),
    );
  }
});

export const clockingOutThunk = createAsyncThunk<
  ClockOutResponse,
  void,
  { rejectValue: string; state: RootState }
>("attendance/clockOut", async (_, thunkApi) => {
  const attendanceContext = getAttendanceContext(thunkApi.getState());

  if (!attendanceContext) {
    return thunkApi.rejectWithValue(
      "Missing attendance context for the logged in user.",
    );
  }

  const payload: ClockOutPayload = {
    date: formatCurrentDate(),
    shift: attendanceContext.shift,
    staff_id: attendanceContext.staffId,
  };

  try {
    const response = await apiClient.put<ClockOutResponse>(
      "/attendance/clockout",
      payload,
      { signal: thunkApi.signal },
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to clock out right now."),
    );
  }
});
