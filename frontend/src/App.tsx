import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { ToastContainer } from "react-toastify";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AuthInitializer from "./components/AuthInitializer";

import Users from "./pages/Users";
import Tasks from "./pages/Tasks";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isLoading } = useAppSelector((state) => state.auth);

  console.log("🔍 isLoading:", isLoading);
  const auth = useAppSelector((state) => state.auth);
  console.log("🔍 auth state:", auth);
  return (
    <>
      <ToastContainer />
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
          <Route path="/users" element={<Users />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin-only route example */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Error or fallback */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
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
