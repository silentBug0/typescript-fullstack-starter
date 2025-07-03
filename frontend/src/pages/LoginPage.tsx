import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
 
  const auth = useAppSelector((state) => state.auth);
  console.log("Redux Auth Slice:", auth); // See what’s inside!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // const response = await fetch("http://localhost:3000/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   dispatch(loginSuccess({ email, token: data.token }));
      //   console.log("Login successful:");
      // } else {
      //   console.error("Login failed:", data.message || "Unknown error");
      //   alert(data.message || "Login failed");
      // }

      const mockEmail = email;
      const mockToken = "mocked-jwt-token-123";

      dispatch(loginSuccess({email: mockEmail, token: mockToken}));

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-[90%] max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center mb-4 space-x-2">
          <input
            type="checkbox"
            id="remember"
            className="mr-2"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember">Remember Me</label>
        </div>

        <div className="flex items-center mb-4 space-x-2">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword" className="ml-1 text-sm">
            Show Password
          </label>
        </div>

        <button
          type="submit"
          disabled={!email || !password}
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
