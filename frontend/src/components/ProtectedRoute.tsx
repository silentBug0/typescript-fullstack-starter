import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
