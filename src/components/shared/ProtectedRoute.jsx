import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from './LoadingState.jsx';
import { useAuth } from '../../features/auth/AuthProvider.jsx';

export function ProtectedRoute({ admin = false, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (admin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
