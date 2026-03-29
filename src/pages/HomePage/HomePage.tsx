import { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentUserName,
  selectCurrentUserRole,
  selectIsAuthenticated,
} from "../../features/Login/LoginSelectors";
import {
  selectStaffAssignments,
  selectStaffAssignmentsError,
  selectStaffAssignmentsStatus,
} from "../../features/Staff/StaffSelectors";
import {
  beginTask,
  fetchStaffAssignmentsThunk,
} from "../../features/Staff/StaffThunk";
import styles from "./HomePage.module.scss";

const formatAssignedAt = (assignedAt: string) => {
  const date = new Date(assignedAt);

  if (Number.isNaN(date.getTime())) {
    return assignedAt;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const HomePage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userName = useAppSelector(selectCurrentUserName);
  const role = useAppSelector(selectCurrentUserRole);
  const assignments = useAppSelector(selectStaffAssignments);
  const assignmentsStatus = useAppSelector(selectStaffAssignmentsStatus);
  const assignmentsError = useAppSelector(selectStaffAssignmentsError);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || role === "ADMIN") {
      return;
    }

    const promise = dispatch(fetchStaffAssignmentsThunk());

    return () => {
      promise.abort();
    };
  }, [dispatch, isAuthenticated, role]);

  const rows = assignments.map((assignment) => ({
    ...assignment,
    actionLabel:
      assignment.status === "PENDING"
        ? "Start Task"
        : assignment.status === "IN_PROGRESS"
          ? "Complete Task"
          : assignment.status,
    taskKey: String(assignment.taskId),
  }));

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  const handleTaskAction = async (taskId: number, status: string) => {
    if (status !== "PENDING") {
      return;
    }

    setActiveTaskId(taskId);

    try {
      await dispatch(beginTask({ taskId })).unwrap();
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : "Unable to begin the selected task.";
      window.alert(message);
    } finally {
      setActiveTaskId(null);
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

      <section className={styles.tasksSection}>
        {assignmentsStatus === "loading" ? (
          <div className={styles.stateCard}>Loading today&apos;s tasks...</div>
        ) : null}

        {assignmentsStatus === "failed" ? (
          <div className={styles.stateCard}>
            {assignmentsError || "Unable to load assignments."}
          </div>
        ) : null}

        {assignmentsStatus === "succeeded" && rows.length === 0 ? (
          <div className={styles.stateCard}>
            No tasks are assigned to you for today.
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Task Type</th>
                  <th>Duration</th>
                  <th>Shift</th>
                  <th>Assigned At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((assignment) => (
                  <tr key={assignment.taskKey}>
                    <td>{assignment.roomId}</td>
                    <td>{assignment.taskType} Cleaning</td>
                    <td>{assignment.durationMinutes} mins</td>
                    <td>{assignment.shift}</td>
                    <td>{formatAssignedAt(assignment.assignedAt)}</td>
                    <td>
                      <span className={styles.statusBadge}>
                        {assignment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.actionButton}
                        type="button"
                        onClick={() =>
                          handleTaskAction(assignment.taskId, assignment.status)
                        }
                        disabled={
                          activeTaskId === assignment.taskId ||
                          !["PENDING", "IN_PROGRESS"].includes(assignment.status)
                        }
                      >
                        {activeTaskId === assignment.taskId
                          ? "Starting..."
                          : assignment.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default HomePage;
