import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, checkAuth } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(checkAuth()); // Check token on page load
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resultAction = await dispatch(
        login({ email, password, rememberMe })
      );
      setLoading(false);
      console.log(
        "resultAction",
        JSON.stringify(resultAction),
        login,
        JSON.stringify(login.fulfilled)
      );

      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else if (login.rejected.match(resultAction)) {
        const errorMessage =
          resultAction.payload || resultAction.error.message || "Login failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-sm text-gray-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-sm text-gray-300">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            id="remember"
            className="accent-blue-500"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember" className="text-sm text-gray-300">
            Remember Me
          </label>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="showPassword"
            className="accent-blue-500"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword" className="text-sm text-gray-300">
            Show Password
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className={`w-full py-2 font-semibold rounded transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-300 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
