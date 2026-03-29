import type { StaffAssignment } from "../../../features/Staff/StaffThunk";
import styles from "../HomePage.module.scss";

type AssignmentsTableProps = {
  activeTaskId: number | null;
  assignments: StaffAssignment[];
  assignmentsError: string | null;
  assignmentsStatus: "idle" | "loading" | "succeeded" | "failed";
  onTaskAction: (taskId: number, status: string) => void;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const rows = (assignments: StaffAssignment[]) =>
  assignments.map((assignment) => ({
    ...assignment,
    actionLabel:
      assignment.status === "PENDING"
        ? "Start Task"
        : assignment.status === "IN_PROGRESS"
          ? "Complete Task"
          : assignment.status === "COMPLETED"
            ? "COMPLETED"
            : assignment.status,
    taskKey: String(assignment.taskId),
  }));

const AssignmentsTable = ({
  activeTaskId,
  assignments,
  assignmentsError,
  assignmentsStatus,
  onTaskAction,
}: AssignmentsTableProps) => {
  const assignmentRows = rows(assignments);

  return (
    <section className={styles.tasksSection}>
      {assignmentsStatus === "loading" ? (
        <div className={styles.stateCard}>Loading today&apos;s tasks...</div>
      ) : null}

      {assignmentsStatus === "failed" ? (
        <div className={styles.stateCard}>
          {assignmentsError || "Unable to load assignments."}
        </div>
      ) : null}

      {assignmentsStatus === "succeeded" && assignmentRows.length === 0 ? (
        <div className={styles.stateCard}>
          No tasks are assigned to you for today.
        </div>
      ) : null}

      {assignmentRows.length > 0 ? (
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
              {assignmentRows.map((assignment) => (
                <tr key={assignment.taskKey}>
                  <td>{assignment.roomId}</td>
                  <td>{assignment.taskType} Cleaning</td>
                  <td>{assignment.durationMinutes} mins</td>
                  <td>{assignment.shift}</td>
                  <td>{formatDateTime(assignment.assignedAt)}</td>
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
                        onTaskAction(assignment.taskId, assignment.status)
                      }
                      disabled={
                        activeTaskId === assignment.taskId ||
                        !["PENDING", "IN_PROGRESS"].includes(assignment.status)
                      }
                    >
                      {activeTaskId === assignment.taskId
                        ? assignment.status === "PENDING"
                          ? "Starting..."
                          : "Completing..."
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
  );
};

export default AssignmentsTable;
