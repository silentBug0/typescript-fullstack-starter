import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { RegisterThunk } from "../store/authSlice";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(RegisterThunk({ email, password, name })).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log(`Exception while doing something: ${error}`);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      <input
        type="text"
        placeholder="Name"
        required
        className="w-full border px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        required
        className="w-full border px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        required
        className="w-full border px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>
    </form>
  );
}
