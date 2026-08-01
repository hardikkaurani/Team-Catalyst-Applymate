import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
            Authenticating session...
          </p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
