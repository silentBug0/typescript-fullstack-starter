import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../store/hooks";
import { toast } from "react-toastify";

const AdminCreateUser = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("✅ User created successfully");
      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const msg =
        typeof axiosError?.response?.data === "object" &&
        axiosError?.response?.data !== null &&
        "message" in axiosError.response.data
          ? (axiosError.response.data as { message: string }).message
          : "❌ Failed to create user";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Create New User</h2>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        className="w-full border px-2 py-1 rounded"
        required
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
        type="email"
        className="w-full border px-2 py-1 rounded"
        required
      />
      <input
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
        type="password"
        className="w-full border px-2 py-1 rounded"
        required
      />
      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="w-full border px-2 py-1 rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create User
      </button>
    </form>
  );
};

export default AdminCreateUser;
