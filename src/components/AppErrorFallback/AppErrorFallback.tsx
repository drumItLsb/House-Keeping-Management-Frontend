import type { FallbackProps } from 'react-error-boundary';

import styles from './AppErrorFallback.module.scss';

const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';

  return (
    <div className={styles.container} role="alert">
      <div className={styles.card}>
        <p className={styles.eyebrow}>Something went wrong</p>
        <h1 className={styles.title}>The application hit an unexpected error.</h1>
        <p className={styles.message}>{errorMessage}</p>
        <button className={styles.button} type="button" onClick={resetErrorBoundary}>
          Try again
        </button>
      </div>
    </div>
  );
};

export default AppErrorFallback;
