import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import BackButton from "./BackButton";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  console.log("🔍 user in ProfilePage:", user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.patch(
        "/auth/profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      toast.success("Profile updated!");
      console.log("✅ Updated profile:", res.data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;

      console.error("❌ Failed to update profile:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            value={name}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={email}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
