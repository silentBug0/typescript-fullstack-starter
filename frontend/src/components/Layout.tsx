import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react"; // No LogOut or useAppDispatch needed here now

const Layout = () => {
  // isOpen state determines if the sidebar is open or closed.
  // This now controls desktop collapse as well.
  const [isOpen, setIsOpen] = useState(true); // Start desktop open (wide)
  // isMobile state tracks if the current screen width is considered mobile.
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, the sidebar's open/collapsed state is now managed by isOpen.
      // On mobile, it's an overlay that starts closed.
      if (!mobile) {
        setIsOpen(true); // Default to open/wide on desktop initially
      } else {
        setIsOpen(false); // Default to closed/overlay on mobile initially
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Component */}
      {/* Pass isOpen to control its width/visibility */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
        ${
          // On mobile, no padding (sidebar is overlay)
          isMobile
            ? "pl-0"
            : // On desktop, adjust padding based on sidebar's isOpen state
            isOpen
            ? "md:pl-0" // When sidebar is open/wide
            : "md:pl-0" // When sidebar is collapsed
        }`}
      >
        {/* Top Bar - sticky at the top, simplified to match image */}
        <div className="sticky top-0 z-30 bg-white shadow p-4 flex items-center">
          {/* Hamburger menu button - always visible on mobile */}
          <button
            className="text-gray-700 hover:text-black md:hidden mr-4"
            onClick={() => setIsOpen(true)} // Opens the mobile sidebar
          >
            <Menu size={28} />
          </button>
          {/* My Application Title and Logout button are REMOVED from here,
              as per image_7c5d04.png */}
          {/* Add a toggle button for the desktop sidebar collapse */}
          {!isMobile && ( // Only show on desktop
            <button
              className="text-gray-700 hover:text-black"
              onClick={() => setIsOpen(!isOpen)} // Toggles sidebar state
            >
              <Menu size={28} />
            </button>
          )}
        </div>

        {/* Main Content (Outlet renders nested routes) */}
        <div className="p-6 flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
