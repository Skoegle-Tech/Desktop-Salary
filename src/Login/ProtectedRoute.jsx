import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {apiUrl} from '../Config';
function ProtectedRoute({ children }) {
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        if (isMounted) {
          setIsValid(false);
          setValidating(false);
        }
        return;
      }
      const { email } = JSON.parse(userJson);
      try {
        const resp = await fetch(`${apiUrl}/check-session?email=${encodeURIComponent(email)}`);
        const result = await resp.json();
        if (resp.ok && result.valid) {
          if (isMounted) {
            setIsValid(true);
            setValidating(false);
          }
        } else {
          // Session NOT valid: Clear storage and logout
          sessionStorage.clear();
          localStorage.clear();
          if (isMounted) {
            setIsValid(false);
            setValidating(false);
          }
        }
      } catch {
        if (isMounted) {
          setIsValid(false);
          setValidating(false);
        }
      }
    }
    checkSession();
    return () => { isMounted = false; };
  }, [location]);

  if (validating) return <div>Checking session...</div>;
  if (!isValid) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;