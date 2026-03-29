import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated, selectLoginStatus } from '../../features/Login/LoginSelectors';
import { logoutThunk } from '../../features/Login/LoginThunk';
import styles from './Header.module.scss';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loginStatus = useAppSelector(selectLoginStatus);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);

    try {
      await dispatch(logoutThunk()).unwrap();
      navigate('/', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to logout right now.';
      window.alert(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const actionLabel = isAuthenticated
    ? isLoggingOut
      ? 'Logging out...'
      : 'Logout'
    : loginStatus === 'loading'
      ? 'Logging in...'
      : 'Login';

  return (
    <header className={styles.header}>
      <div className={styles.brand}>House Keeping Management System</div>
      <button
        className={styles.action}
        type="button"
        onClick={isAuthenticated ? handleLogoutClick : handleLoginClick}
        disabled={isLoggingOut || loginStatus === 'loading'}
      >
        {actionLabel}
      </button>
    </header>
  );
};

export default Header;
