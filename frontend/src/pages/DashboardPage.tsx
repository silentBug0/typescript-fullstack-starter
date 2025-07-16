import { useEffect } from "react";
import { DashboardThunk } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import BackButton from "./BackButton";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(DashboardThunk());
    }
  }, [user, isAuthenticated, dispatch]);

  return (
    <div className="p-8">
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      ) : (
        <p>Loading user data....</p>
      )}
    </div>
  );
}
