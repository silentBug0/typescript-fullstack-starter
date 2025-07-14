import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { ToastContainer } from "react-toastify";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AuthInitializer from "./components/AuthInitializer";

import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";
import { connectSocket, disconnectSocket } from "./socket";
import { useEffect } from "react";
import AdminCreateUser from "./pages/AdminCreateUser";

function App() {
  const { isLoading } = useAppSelector((state) => state.auth);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    // Optional: disconnect on tab close or reload
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  console.log("🔍 isLoading:", isLoading);
  const auth = useAppSelector((state) => state.auth);
  console.log("🔍 auth state:", auth);

  return (
    <>
      <ToastContainer
        limit={2} // ✅ Only 2 toasts on screen
        autoClose={1000}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Admin-only route (if needed) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute role="admin">
                <AdminCreateUser />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

const RootApp = () => {
  return (
    <>
      <AuthInitializer />
      <App />
    </>
  );
};

export default RootApp;
