import { Navigate } from 'react-router';

import { useAppSelector } from '../../app/hooks';
import {
  selectCurrentUserName,
  selectCurrentUserRole,
  selectIsAuthenticated,
} from '../../features/Login/LoginSelectors';
import styles from './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userName = useAppSelector(selectCurrentUserName);
  const role = useAppSelector(selectCurrentUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Admin Dashboard</p>
        <h1 className={styles.title}>Welcome, {userName || 'Administrator'}.</h1>
        <p className={styles.description}>
          You are signed in with administrative access and can manage the housekeeping system
          from here.
        </p>
      </section>
    </main>
  );
};

export default AdminDashboard;
