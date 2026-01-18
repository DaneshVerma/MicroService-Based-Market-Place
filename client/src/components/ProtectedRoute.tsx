import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('buyer' | 'seller' | 'admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
