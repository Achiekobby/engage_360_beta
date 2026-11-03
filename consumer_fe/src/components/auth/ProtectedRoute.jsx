import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pendingVerification = useAppSelector((state) => state.auth.pendingVerification);
  const email = useAppSelector((state) => state.auth.user?.email || '');
  const location = useLocation();

  if (!isAuthenticated) {
    if (pendingVerification && email) {
      return (
        <Navigate
          to="/verify-otp"
          replace
          state={{ email, requestNewCode: true, from: location.pathname }}
        />
      );
    }
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
