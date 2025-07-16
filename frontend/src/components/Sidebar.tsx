import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks"; // Keep dispatch for logout
import { logout } from "../store/authSlice"; // Keep logout action
import {
  LayoutDashboard,
  User,
  Users,
  Shield,
  PlusCircle,
  ListChecks,
  LogOut, // LogOut is back in the sidebar
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch(); // Dispatch is used for logout

  const menuItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    { to: "/profile", icon: <User size={18} />, label: "Profile" },
    { to: "/users", icon: <Users size={18} />, label: "Users" },
    {
      to: "/admin",
      icon: <Shield size={18} />,
      label: "Admin Panel",
      adminOnly: true,
    },
    {
      to: "/admin/add-user",
      icon: <PlusCircle size={18} />,
      label: "Add User",
      adminOnly: true,
    },
    { to: "/tasks", icon: <ListChecks size={18} />, label: "Tasks" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200 ${
      isActive
        ? "bg-yellow-400 text-black font-bold"
        : "text-white hover:bg-blue-500"
    }`;

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } 
          fixed md:static top-0 left-0 h-screen bg-blue-900 text-white shadow-lg z-50
          flex flex-col justify-between transition-all duration-300
          ${
            isOpen ? "w-64" : "w-20"
          } md:translate-x-0`} 
      >
        {/* Header */}
        <div className="flex justify-center items-center px-2 pt-4 jsu">
          <h2
            className={`text-2xl font-bold transition-opacity ${
              isOpen ? "opacity-100" : "opacity-0 md:opacity-100" // Opacity transition restored for "Menu"
            }`}
          >
            Menu
          </h2>
          <button className="md:hidden" onClick={onClose}>
            <X />
          </button>
        </div>

        <nav className="mt-6 flex flex-col space-y-2">
          {menuItems.map(({ to, icon, label, adminOnly }) =>
            !adminOnly || auth.user?.role === "admin" ? (
              <NavLink key={to} to={to} className={linkClass}>
                {icon}
                {isOpen && <span>{label}</span>} {/* Label visible only when open */}
                {!isOpen && ( // Tooltip for collapsed state
                  <span className="absolute left-full ml-2 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white opacity-0 group-hover:opacity-100 transition-all z-50">
                    {label}
                  </span>
                )}
              </NavLink>
            ) : null
          )}
        </nav>

        {/* Logout button is back in the sidebar */}
        <button
          onClick={() => dispatch(logout())}
          className="mt-6 mb-4 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>} {/* "Logout" text visible only when open */}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;