// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-blue-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
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
