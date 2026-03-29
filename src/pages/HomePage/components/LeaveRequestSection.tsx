import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  LeaveResponse,
  LeaveType,
} from "../../../features/Staff/StaffThunk";
import styles from "../HomePage.module.scss";

const leaveSchema = z.object({
  date: z.string().trim().min(1, "Date is required."),
  leaveType: z.enum(["PLANNED", "SICK"]),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

type LeaveRequestSectionProps = {
  isLeaveModalOpen: boolean;
  isSubmitting: boolean;
  leaveApplication: LeaveResponse | null;
  onClose: () => void;
  onOpen: () => void;
  onSubmit: (values: LeaveFormValues) => Promise<void>;
};

const formatAppliedDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
};

const formatLeaveType = (value: LeaveType) =>
  value === "PLANNED" ? "Planned" : "Sick";

const getTodayDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const LeaveRequestSection = ({
  isLeaveModalOpen,
  isSubmitting,
  leaveApplication,
  onClose,
  onOpen,
  onSubmit,
}: LeaveRequestSectionProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    defaultValues: {
      date: getTodayDate(),
      leaveType: "PLANNED",
    },
    resolver: zodResolver(leaveSchema),
  });

  useEffect(() => {
    if (!isLeaveModalOpen) {
      reset({
        date: getTodayDate(),
        leaveType: "PLANNED",
      });
    }
  }, [isLeaveModalOpen, reset]);

  const submitLeaveForm = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <section className={styles.leaveSection}>
      <article className={styles.leaveCard}>
        <div className={styles.leaveHeader}>
          <div>
            <p className={styles.cardEyebrow}>Leave</p>
            <h2 className={styles.cardTitle}>Apply for leave</h2>
          </div>

          <button
            className={styles.leaveButton}
            type="button"
            onClick={onOpen}
          >
            Apply Leave
          </button>
        </div>

        <div className={styles.leaveStatusCard}>
          <span className={styles.leaveStatusLabel}>Applied Leave Status</span>

          {leaveApplication ? (
            <div className={styles.leaveStatusGrid}>
              <div className={styles.leaveStatusItem}>
                <span>Date</span>
                <strong>{formatAppliedDate(leaveApplication.date)}</strong>
              </div>

              <div className={styles.leaveStatusItem}>
                <span>Leave Type</span>
                <strong>{formatLeaveType(leaveApplication.leaveType)}</strong>
              </div>

              <div className={styles.leaveStatusItem}>
                <span>Shift</span>
                <strong>{leaveApplication.shift}</strong>
              </div>

              <div className={styles.leaveStatusItem}>
                <span>Status</span>
                <strong>{leaveApplication.status}</strong>
              </div>
            </div>
          ) : (
            <p className={styles.leaveEmptyState}>
              No leave application submitted from this session yet.
            </p>
          )}
        </div>
      </article>

      {isLeaveModalOpen ? (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={onClose}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.cardEyebrow}>Leave Request</p>
                <h3 className={styles.modalTitle} id="leave-modal-title">
                  Submit your leave request
                </h3>
              </div>

              <button
                className={styles.modalCloseButton}
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Close
              </button>
            </div>

            <form className={styles.leaveForm} onSubmit={submitLeaveForm} noValidate>
              <label className={styles.field}>
                <span>Date</span>
                <input className={styles.input} type="date" {...register("date")} />
                {errors.date ? (
                  <small className={styles.error}>{errors.date.message}</small>
                ) : null}
              </label>

              <label className={styles.field}>
                <span>Leave Type</span>
                <select className={styles.select} {...register("leaveType")}>
                  <option value="PLANNED">PLANNED</option>
                  <option value="SICK">SICK</option>
                </select>
                {errors.leaveType ? (
                  <small className={styles.error}>
                    {errors.leaveType.message}
                  </small>
                ) : null}
              </label>

              <button
                className={styles.submitLeaveButton}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Leave"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default LeaveRequestSection;
