import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}
