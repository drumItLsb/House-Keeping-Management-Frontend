import { useEffect } from "react";
import { Navigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAssignmentMapping,
  selectAssignmentMappingError,
  selectAssignmentMappingStatus,
  selectAssignmentSummary,
  selectAssignmentSummaryError,
  selectAssignmentSummaryStatus,
  selectShortfall,
  selectShortfallError,
  selectShortfallStatus,
} from "../../features/Dashboard/DashboardSelectors";
import {
  assignmentMappingThunk,
  assignmentSummaryThunk,
  shortfallThunk,
} from "../../features/Dashboard/DashboardThunk";
import {
  selectCurrentUserName,
  selectCurrentUserRole,
  selectIsAuthenticated,
} from "../../features/Login/LoginSelectors";
import styles from "./AdminDashboard.module.scss";

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
};

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userName = useAppSelector(selectCurrentUserName);
  const role = useAppSelector(selectCurrentUserRole);
  const assignmentSummary = useAppSelector(selectAssignmentSummary);
  const assignmentSummaryStatus = useAppSelector(selectAssignmentSummaryStatus);
  const assignmentSummaryError = useAppSelector(selectAssignmentSummaryError);
  const assignmentMapping = useAppSelector(selectAssignmentMapping);
  const assignmentMappingStatus = useAppSelector(selectAssignmentMappingStatus);
  const assignmentMappingError = useAppSelector(selectAssignmentMappingError);
  const shortfall = useAppSelector(selectShortfall);
  const shortfallStatus = useAppSelector(selectShortfallStatus);
  const shortfallError = useAppSelector(selectShortfallError);
  const isDashboardLoading =
    assignmentSummaryStatus === "loading" ||
    assignmentMappingStatus === "loading" ||
    shortfallStatus === "loading";

  useEffect(() => {
    if (!isAuthenticated || role !== "ADMIN") {
      return;
    }

    const summaryPromise = dispatch(assignmentSummaryThunk());
    const mappingPromise = dispatch(assignmentMappingThunk());
    const shortfallPromise = dispatch(shortfallThunk());

    return () => {
      summaryPromise.abort();
      mappingPromise.abort();
      shortfallPromise.abort();
    };
  }, [dispatch, isAuthenticated, role]);

  if (!isAuthenticated) {
      return <Navigate to="/" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Admin Dashboard</p>
        <h1 className={styles.title}>Welcome, {userName || "Administrator"}.</h1>
        <p className={styles.description}>
          Track today&apos;s housekeeping coverage, assignment distribution, and
          staffing shortfall from one place.
        </p>
      </section>

      {isDashboardLoading ? (
        <section className={styles.section}>
          <div className={styles.stateCard}>
            Loading dashboard data for summary, mapping, and shortfall...
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Assignments Summary</p>
            <h2 className={styles.sectionTitle}>Today&apos;s operational overview</h2>
          </div>
          {assignmentSummary?.date ? (
            <span className={styles.dateChip}>
              {formatDate(assignmentSummary.date)}
            </span>
          ) : null}
        </div>

        {assignmentSummaryStatus === "failed" ? (
          <div className={styles.stateCard}>
            {assignmentSummaryError || "Unable to load assignment summary."}
          </div>
        ) : null}

        {assignmentSummary ? (
          <div className={styles.summaryGrid}>
            <article className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Room Summary</h3>
              <dl className={styles.metricsList}>
                <div className={styles.metricItem}>
                  <dt>Daily Clean</dt>
                  <dd>{assignmentSummary.roomSummary.dailyClean}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Deep Clean</dt>
                  <dd>{assignmentSummary.roomSummary.deepClean}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Occupied</dt>
                  <dd>{assignmentSummary.roomSummary.occupied}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Vacant</dt>
                  <dd>{assignmentSummary.roomSummary.vacant}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Vacant Clean</dt>
                  <dd>{assignmentSummary.roomSummary.vacantClean}</dd>
                </div>
              </dl>
            </article>

            <article className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Staff Summary</h3>
              <dl className={styles.metricsList}>
                <div className={styles.metricItem}>
                  <dt>On Duty</dt>
                  <dd>{assignmentSummary.staffSummary.onDuty}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>On Leave</dt>
                  <dd>{assignmentSummary.staffSummary.onLeave}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Sick</dt>
                  <dd>{assignmentSummary.staffSummary.sick}</dd>
                </div>
              </dl>
            </article>

            <article className={styles.summaryCard}>
              <h3 className={styles.cardTitle}>Task Summary</h3>
              <dl className={styles.metricsList}>
                <div className={styles.metricItem}>
                  <dt>Completed</dt>
                  <dd>{assignmentSummary.taskSummary.completed}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>In Progress</dt>
                  <dd>{assignmentSummary.taskSummary.inProgress}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Pending</dt>
                  <dd>{assignmentSummary.taskSummary.pending}</dd>
                </div>
                <div className={styles.metricItem}>
                  <dt>Reassigned</dt>
                  <dd>{assignmentSummary.taskSummary.reassigned}</dd>
                </div>
              </dl>
            </article>
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Assignment Mapping</p>
            <h2 className={styles.sectionTitle}>Morning and afternoon allocation</h2>
          </div>
        </div>

        {assignmentMappingStatus === "failed" ? (
          <div className={styles.stateCard}>
            {assignmentMappingError || "Unable to load assignment mapping."}
          </div>
        ) : null}

        {assignmentMappingStatus === "succeeded" && assignmentMapping.length === 0 ? (
          <div className={styles.stateCard}>No assignment mapping found for today.</div>
        ) : null}

        {assignmentMapping.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Room ID</th>
                  <th>Staff ID</th>
                  <th>Task Type</th>
                  <th>Duration</th>
                  <th>Shift</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignmentMapping.map((item, index) => (
                  <tr key={`${item.shift}-${item.roomId}-${item.staffId}-${index}`}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.roomId}</td>
                    <td>{item.staffId}</td>
                    <td>{item.taskType}</td>
                    <td>{item.durationMinutes} mins</td>
                    <td>{item.shift}</td>
                    <td>
                      <span className={styles.statusBadge}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Shortfall Indicator</p>
            <h2 className={styles.sectionTitle}>Immediate staffing signal</h2>
          </div>
        </div>

        {shortfallStatus === "failed" ? (
          <div className={styles.stateCard}>
            {shortfallError || "Unable to load shortfall indicator."}
          </div>
        ) : null}

        {shortfall ? (
          <article
            className={`${styles.shortfallCard} ${
              shortfall.resolved ? styles.shortfallResolved : styles.shortfallOpen
            }`}
          >
            <div className={styles.shortfallTopRow}>
              <div>
                <p className={styles.shortfallLabel}>Date</p>
                <strong>{formatDate(shortfall.date)}</strong>
              </div>
              <span className={styles.shortfallShift}>{shortfall.shift}</span>
            </div>

            <div className={styles.shortfallMainValue}>
              {shortfall.extraStaffNeeded}
            </div>
            <p className={styles.shortfallText}>Extra staff needed</p>

            <p className={styles.shortfallStatusText}>
              Status: {shortfall.resolved ? "Resolved" : "Unresolved"}
            </p>
          </article>
        ) : null}
      </section>
    </main>
  );
};

export default AdminDashboard;
