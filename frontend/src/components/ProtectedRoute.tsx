// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
