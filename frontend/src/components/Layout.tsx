import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const location = useLocation();

  // Optional: Map routes to page titles
  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/users": "Users",
    "/tasks": "Tasks",
    "/admin": "Admin Panel",
    "/admin/add-user": "Add User",
  };
  const pageTitle = routeTitles[location.pathname] || "My App";

  // Detect screen size
  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Sidebar open on desktop, closed on mobile
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Apply dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : isOpen ? "ml-0" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) */}
            {isMobile && (
              <button
                className="text-gray-700 dark:text-white hover:text-black"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={28} />
              </button>
            )}

            {/* Collapse Toggle (desktop) */}
            {!isMobile && (
              <button
                className="text-gray-700 dark:text-white hover:text-black"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <Menu size={28} />
              </button>
            )}

            {/* Logo & Page Title */}
            <div className="flex items-center gap-2">
              <img src="/logo192.png" className="h-8 w-8" alt="Logo" />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="text-gray-700 dark:text-white hover:text-black dark:hover:text-yellow-400"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* Nested Route Content */}
        <div className="p-6 text-gray-800 dark:text-white flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
