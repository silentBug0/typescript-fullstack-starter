import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="px-6 py-4 font-bold text-lg border-b">🏠 MyApp</div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          <NavItem label="Dashboard" to="/dashboard" />
          <NavItem label="Users" to="/users" />
          <NavItem label="Tasks" to="/tasks" />
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="text-right text-sm text-gray-600 mb-4">
          Welcome, user@example.com {/* optional: use actual user data */}
        </div>
        {children}
      </div>
    </div>
  );
}

function NavItem({ label, to }: { label: string; to: string }) {
  return (
    <a
      href={to}
      className="block px-4 py-2 rounded hover:bg-gray-200 text-gray-700"
    >
      {label}
    </a>
  );
}
