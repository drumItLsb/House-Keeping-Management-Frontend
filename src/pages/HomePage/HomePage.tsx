import { Navigate } from 'react-router';

import { useAppSelector } from '../../app/hooks';
import { selectCurrentUserName, selectIsAuthenticated } from '../../features/Login/LoginSelectors';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userName = useAppSelector(selectCurrentUserName);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Dashboard</p>
        <h1 className={styles.title}>Welcome back{userName ? `, ${userName}` : ''}.</h1>
        <p className={styles.description}>
          Your housekeeping workspace is ready. This page is protected and only visible after
          login.
        </p>
      </section>
    </main>
  );
};

export default HomePage;
