import React, { useState, Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import LoginForm from './Login/LoginForm.jsx';
import ProtectedRoute from './Login/ProtectedRoute.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const SalarySlipPage = lazy(() => import('./pages/SalarySlipPage.jsx'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginForm onLogin={handleLogin} />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Suspense fallback={<div>Loading Home...</div>}>
            <Home />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/salary-slip/:employeeNumber',
      element: (
        <ProtectedRoute>
          <Suspense fallback={<div>Loading Salary Slip...</div>}>
            <SalarySlipPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;