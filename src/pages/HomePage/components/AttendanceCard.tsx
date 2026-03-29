import styles from "../HomePage.module.scss";

type AttendanceCardProps = {
  attendanceActionLabel: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  earlyExit: boolean | null;
  isAttendanceUpdating: boolean;
  isClockActionDisabled: boolean;
  isClockedIn: boolean;
  onAttendanceAction: () => void;
  workedHours: string | null;
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

const formatAttendanceValue = (value: string | null, emptyText: string) =>
  value ? formatDateTime(value) : emptyText;

const AttendanceCard = ({
  attendanceActionLabel,
  clockInTime,
  clockOutTime,
  earlyExit,
  isAttendanceUpdating,
  isClockActionDisabled,
  isClockedIn,
  onAttendanceAction,
  workedHours,
}: AttendanceCardProps) => (
  <section className={styles.attendanceSection}>
    <article className={styles.attendanceCard}>
      <div className={styles.attendanceHeader}>
        <div>
          <p className={styles.cardEyebrow}>Attendance</p>
          <h2 className={styles.cardTitle}>Mark your shift for today</h2>
        </div>

        <button
          className={styles.attendanceButton}
          type="button"
          onClick={onAttendanceAction}
          disabled={isAttendanceUpdating || isClockActionDisabled}
        >
          {isAttendanceUpdating
            ? isClockedIn
              ? "Clocking out..."
              : "Clocking in..."
            : attendanceActionLabel}
        </button>
      </div>

      <div className={styles.attendanceDetails}>
        <div className={styles.attendanceInfo}>
          <span className={styles.attendanceLabel}>Clocked In</span>
          <strong className={styles.attendanceValue}>
            {formatAttendanceValue(clockInTime, "Not clockedIn for the day")}
          </strong>
        </div>

        <div className={styles.attendanceInfo}>
          <span className={styles.attendanceLabel}>Clocked Out</span>
          <strong className={styles.attendanceValue}>
            {formatAttendanceValue(clockOutTime, "Not clockedOut for the day")}
          </strong>
        </div>

        {clockOutTime ? (
          <div className={styles.attendanceInfo}>
            <span className={styles.attendanceLabel}>Worked Hours</span>
            <strong className={styles.attendanceValue}>
              {workedHours || "Not available"}
            </strong>
          </div>
        ) : null}

        {clockOutTime ? (
          <div className={styles.attendanceInfo}>
            <span className={styles.attendanceLabel}>Early Exit</span>
            <strong className={styles.attendanceValue}>
              {earlyExit ? "Yes" : "No"}
            </strong>
          </div>
        ) : null}
      </div>
    </article>
  </section>
);

export default AttendanceCard;
