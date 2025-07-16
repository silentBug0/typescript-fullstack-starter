// src/pages/AdminPage.tsx
import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import axios from "axios";
import { promoteUser, deleteUser } from "../api/admin";
import { toast } from "react-toastify";
import BackButton from "./BackButton";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const rawToken = useAppSelector((state) => state.auth.token);
  const token =
    rawToken ??
    localStorage.getItem("token") ??
    sessionStorage.getItem("token") ??
    ""; // ✅ fallback to empty string
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log("Failed to fetch users:", err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: number, role: string) => {
    // if (id === currentUserId) {
    //   toast.error("You cannot change your own role");
    //   return;
    // }

    const newRole = role === "admin" ? "user" : "admin";
    await promoteUser(id, newRole, token);
  };

  const handleDelete = async (id: number) => {
    if (id === currentUserId) {
      toast.error("You cannot delete yourself");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id, token);
      toast.success("User deleted");
      fetchUsers();
    }
  };

  return (
    <div>
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">⚙️ Admin Panel</h1>
      <table className="w-full border rounded">
        <thead className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className={`border-b ${
                u.id === currentUserId
                  ? "bg-amber-700 dark:bg-blue-300 dark:text-black px-2 py-1 rounded"
                  : ""
              }`}
            >
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleRoleChange(u.id, u.role)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold w-[110px] text-center"
                >
                  {u.role === "admin" ? "Make User" : "Make Admin"}
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
