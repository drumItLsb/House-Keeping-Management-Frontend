import { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectClockInTime,
  selectClockOutTime,
  selectEarlyExit,
  selectIsClockedIn,
  selectWorkedHours,
} from "../../features/Attendance/AttendanceSelectors";
import {
  clockingInThunk,
  clockingOutThunk,
} from "../../features/Attendance/AttendanceThunk";
import {
  selectCurrentUserName,
  selectCurrentUserRole,
  selectIsAuthenticated,
} from "../../features/Login/LoginSelectors";
import {
  selectStaffAssignmentsError,
  selectStaffAssignmentsStatus,
  selectStaffAssignments,
  selectLeaveApplication,
} from "../../features/Staff/StaffSelectors";
import {
  beginTask,
  completeTask,
  fetchStaffAssignmentsThunk,
  leaveThunk,
  type LeaveType,
} from "../../features/Staff/StaffThunk";
import AssignmentsTable from "./components/AssignmentsTable";
import AttendanceCard from "./components/AttendanceCard";
import LeaveRequestSection from "./components/LeaveRequestSection";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userName = useAppSelector(selectCurrentUserName);
  const role = useAppSelector(selectCurrentUserRole);
  const clockInTime = useAppSelector(selectClockInTime);
  const clockOutTime = useAppSelector(selectClockOutTime);
  const earlyExit = useAppSelector(selectEarlyExit);
  const isClockedIn = useAppSelector(selectIsClockedIn);
  const workedHours = useAppSelector(selectWorkedHours);
  const assignments = useAppSelector(selectStaffAssignments);
  const assignmentsStatus = useAppSelector(selectStaffAssignmentsStatus);
  const assignmentsError = useAppSelector(selectStaffAssignmentsError);
  const leaveApplication = useAppSelector(selectLeaveApplication);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isAttendanceUpdating, setIsAttendanceUpdating] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeaveSubmitting, setIsLeaveSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || role === "ADMIN") {
      return;
    }

    const promise = dispatch(fetchStaffAssignmentsThunk());

    return () => {
      promise.abort();
    };
  }, [dispatch, isAuthenticated, role]);
  const isClockActionDisabled = Boolean(clockOutTime);
  const attendanceActionLabel = !clockInTime ? "ClockIn" : "ClockOut";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  const handleTaskAction = async (taskId: number, status: string) => {
    if (!["PENDING", "IN_PROGRESS"].includes(status)) {
      return;
    }

    setActiveTaskId(taskId);

    try {
      if (status === "PENDING") {
        await dispatch(beginTask({ taskId })).unwrap();
      }

      if (status === "IN_PROGRESS") {
        await dispatch(completeTask({ taskId })).unwrap();
      }
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : status === "PENDING"
            ? "Unable to begin the selected task."
            : "Unable to complete the selected task.";
      window.alert(message);
    } finally {
      setActiveTaskId(null);
    }
  };

  const handleAttendanceAction = async () => {
    if (isClockActionDisabled) {
      return;
    }

    setIsAttendanceUpdating(true);

    try {
      if (isClockedIn) {
        await dispatch(clockingOutThunk()).unwrap();
        return;
      }

      await dispatch(clockingInThunk()).unwrap();
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : isClockedIn
            ? "Unable to clock out right now."
            : "Unable to clock in right now.";

      window.alert(message);
    } finally {
      setIsAttendanceUpdating(false);
    }
  };

  const handleLeaveSubmit = async (values: {
    date: string;
    leaveType: LeaveType;
  }) => {
    setIsLeaveSubmitting(true);

    try {
      await dispatch(leaveThunk(values)).unwrap();
      setIsLeaveModalOpen(false);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : "Unable to apply for leave right now.";

      window.alert(message);
    } finally {
      setIsLeaveSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Today&apos;s Assignments</p>
        <h1 className={styles.title}>
          Welcome back{userName ? `, ${userName}` : ""}.
        </h1>
        <p className={styles.description}>
          Review the tasks assigned to you for today and start working through
          them one by one.
        </p>
      </section>

      <AttendanceCard
        attendanceActionLabel={attendanceActionLabel}
        clockInTime={clockInTime}
        clockOutTime={clockOutTime}
        earlyExit={earlyExit}
        isAttendanceUpdating={isAttendanceUpdating}
        isClockActionDisabled={isClockActionDisabled}
        isClockedIn={isClockedIn}
        onAttendanceAction={handleAttendanceAction}
        workedHours={workedHours}
      />

      <LeaveRequestSection
        isLeaveModalOpen={isLeaveModalOpen}
        isSubmitting={isLeaveSubmitting}
        leaveApplication={leaveApplication}
        onClose={() => setIsLeaveModalOpen(false)}
        onOpen={() => setIsLeaveModalOpen(true)}
        onSubmit={handleLeaveSubmit}
      />

      <AssignmentsTable
        activeTaskId={activeTaskId}
        assignments={assignments}
        assignmentsError={assignmentsError}
        assignmentsStatus={assignmentsStatus}
        onTaskAction={handleTaskAction}
      />
    </main>
  );
};

export default HomePage;
