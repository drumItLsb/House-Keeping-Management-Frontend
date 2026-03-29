import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import apiClient from "../../service/apiClient";
import {
  clearStoredAuth,
  getAccessToken,
  writeStoredAuth,
} from "./LoginStorage";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  propertyId: string;
  role: string;
  staffId: number;
  token: string;
  tokenType: string;
  userName: string;
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

export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("login/loginThunk", async (payload, thunkApi) => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      {
        userName: payload.username,
        password: payload.password,
      },
      { signal: thunkApi.signal },
    );
    console.log(response.data);

    writeStoredAuth(response.data);

    return response.data;
  } catch (error) {
    clearStoredAuth();
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Login failed. Please verify your credentials."),
    );
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("login/logoutThunk", async (_, thunkApi) => {
  try {
    const token = getAccessToken();

    await apiClient.post(
      "/auth/logout",
      {},
      {
        signal: thunkApi.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      },
    );

    clearStoredAuth();
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Logout failed. Please try again."),
    );
  }
});
