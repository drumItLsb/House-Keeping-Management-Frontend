import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App';
import AppErrorFallback from './components/AppErrorFallback';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary FallbackComponent={AppErrorFallback}>
        <App />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
