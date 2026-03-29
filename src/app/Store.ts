import { configureStore } from '@reduxjs/toolkit';

import attendanceReducer from "../features/Attendance/AttendanceSlice";
import loginReducer from "../features/Login/LoginSlice";
import staffReducer from "../features/Staff/StaffSlice";

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    login: loginReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
