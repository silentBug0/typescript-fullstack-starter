// src/components/layout/Navbar.tsx
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");

    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">My App</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;