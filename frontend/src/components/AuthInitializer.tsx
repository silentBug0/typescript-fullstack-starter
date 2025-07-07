import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { checkAuth } from "../store/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      console.log("🧠 AuthInitializer is running...");
      hasRun.current = true;

      dispatch(checkAuth())
        .unwrap()
        .then(() => console.log("✅ Auth restored from localStorage"))
        .catch(() => {
          const token = localStorage.getItem("token");

          if (token) {
            toast.error("Session expired. Please login.");
          }

          navigate("/", { replace: true });
        });
    }
  }, [dispatch, navigate]); // ✅ RUNS ONLY ONCE

  return null;
};

export default AuthInitializer;
