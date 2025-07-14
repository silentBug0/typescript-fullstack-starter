// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const Sidebar = () => {
  const auth = useAppSelector((state) => state.auth);

  return (
    <aside className="w-64 bg-blue-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition ${
              isActive
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-700"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition ${
              isActive
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-700"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition ${
              isActive
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-700"
            }`
          }
        >
          Users
        </NavLink>

        {/* ✅ Conditionally render Admin Panel */}
        {auth.user?.role === "admin" && (
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive
                  ? "bg-yellow-400 text-black font-semibold"
                  : "hover:bg-blue-700"
              }`
            }
          >
            Admin Panel
          </NavLink>
        )}

        <NavLink
          to="/admin/add-user"
          className={({ isActive }) =>
            `px-3 py-2 rounded font-bold flex items-center gap-1 ${
              isActive ? "bg-yellow-400 text-black" : "hover:bg-blue-700"
            }`
          }
        >
          <span>➕</span> Add User
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `px-3 py-2 rounded transition ${
              isActive
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-blue-700"
            }`
          }
        >
          Tasks
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
