import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import BackButton from "./BackButton";
import axios from "axios";

export default function ProfilePage() {
  const auth = useAppSelector((state) => state.auth);
  const user = auth.user;
  console.log("🔍 user in ProfilePage:", user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const token =
    auth.token ??
    localStorage.getItem("token") ??
    sessionStorage.getItem("token");

  // Pre-fill form with user data
  // useEffect(() => {
  //   if (user) {
  //     setName(user.name || "");
  //     setEmail(user.email || "");
  //   }
  // }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      if (!user) return;
      try {


        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setName(res.data.name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error("❌ Failed to load users", err);
      }
    };

    fetchUser();
  }, [token, user]);

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
            className="border border-gray-300 rounded px-3 py-2 w-full dark:text-black"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={email}
            className="border border-gray-300 rounded px-3 py-2 w-full dark:text-black"
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
