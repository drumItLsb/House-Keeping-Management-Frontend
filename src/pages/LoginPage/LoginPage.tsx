import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearLoginError } from "../../features/Login/LoginSlice";
import {
  selectCurrentUserRole,
  selectIsAuthenticated,
  selectLoginError,
  selectLoginStatus,
} from "../../features/Login/LoginSelectors";
import { loginThunk } from "../../features/Login/LoginThunk";
import styles from "./LoginPage.module.scss";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "User Name should have minimum length of 3."),
  password: z
    .string()
    .trim()
    .min(3, "Password should have minimum length of 3"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type AbortableRequest = { abort: () => void };

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectLoginStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loginError = useAppSelector(selectLoginError);
  const role = useAppSelector(selectCurrentUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      password: "",
      username: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const loginPromiseRef = useRef<AbortableRequest | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === "ADMIN" ? "/admin" : "/home", { replace: true });
    }
  }, [isAuthenticated, navigate, role]);

  useEffect(() => {
    return () => {
      loginPromiseRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (loginError) {
      window.alert(loginError);
      dispatch(clearLoginError());
    }
  }, [dispatch, loginError]);

  const onSubmit = handleSubmit(async (values) => {
    const promise = dispatch(loginThunk(values));
    loginPromiseRef.current = promise;

    try {
      const result = await promise.unwrap();
      navigate(result.role === "ADMIN" ? "/admin" : "/home", { replace: true });
    } catch (error) {
      const message =
        typeof error === "string" ? error : "Unable to login right now.";
      window.alert(message);
    } finally {
      loginPromiseRef.current = null;
    }
  });

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Secure Access</p>
          <h1 className={styles.title}>
            Sign in to manage your housekeeping operations.
          </h1>
          <p className={styles.description}>
            Enter your username and password to continue to the management
            dashboard.
          </p>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label className={styles.field}>
            <span>User Name</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your username"
              {...register("username")}
            />
            {errors.username ? (
              <small className={styles.error}>{errors.username.message}</small>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password ? (
              <small className={styles.error}>{errors.password.message}</small>
            ) : null}
          </label>

          <button
            className={styles.submit}
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
