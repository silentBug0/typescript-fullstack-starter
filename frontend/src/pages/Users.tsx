import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../store/hooks";
import { promoteUser } from "../api/admin";
import BackButton from "./BackButton";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const auth = useAppSelector((state) => state.auth);
  const role = auth.user?.role;

  const token =
    auth.token ??
    localStorage.getItem("token") ??
    sessionStorage.getItem("token");
  console.log("🔑 Users token:", token); // Debugging line

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to load users", err);
      }
    };

    fetchUsers();
  }, [token]);

  if (!token) return <p>🔐 Secured. Loading token...</p>;

  return (
    <div>
      <BackButton />

      <h1 className="text-xl font-bold mb-4">👥 All Users</h1>

      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                {role === "admin" ? (
                  <select
                    value={u.role}
                    onChange={async (e) => {
                      const newRole = e.target.value as "user" | "admin";
                      if (newRole !== u.role) {
                        try {
                          const status = await promoteUser(
                            u.id,
                            newRole,
                            token
                          );

                          if (status) {
                            setUsers((prev) =>
                              prev.map((usr) =>
                                usr.id === u.id
                                  ? { ...usr, role: newRole }
                                  : usr
                              )
                            );
                          }
                        } catch (err) {
                          console.error("❌ Failed to update role", err);
                        }
                      }
                    }}
                    className="border rounded px-1 py-0.5 text-sm"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
