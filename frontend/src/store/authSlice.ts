import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../api/axios";
import { disconnectSocket } from "../socket";

interface User {
    id: number;
    name?: string;
    email: string;
    role: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true, // ✅ must be TRUE to show "Checking session..."
};

// 🔍 Check session from localStorage
export const checkAuth = createAsyncThunk<
    { token: string; user: User },
    void,
    { rejectValue: string }
>("auth/checkAuth", async (_, thunkAPI) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (token && user) {
        return { token, user: JSON.parse(user) };
    }

    return thunkAPI.rejectWithValue("No token found");
});

// 📝 Register
export const RegisterThunk = createAsyncThunk(
    "auth/register",
    async ({ email, password, name }: { email: string; password: string; name: string }) => {
        const res = await api.post("/auth/register", { email, password, name });
        const token = res.data.access_token;
        const user: User = res.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        return { token, user };
    }
);

// 🔑 Login
export const login = createAsyncThunk<
    { token: string; user: User },
    { email: string; password: string, rememberMe: boolean },
    { rejectValue: string }
>("auth/login", async (credentials, thunkAPI) => {
    try {
        const res = await api.post("/auth/login", credentials);
        const token = res.data.access_token;
        const user: User = res.data.user;

        if (credentials.rememberMe) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user));
        }
      

        return { token, user };
    } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Login failed"
        );
    }
});

// 👤 Authenticated user info
export const DashboardThunk = createAsyncThunk("auth/dashboard", async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("🔑 DashboardThunk token:", token);   
    const res = await api.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.data) {
        throw new Error("No data found");
    }

    return res.data;
});

// 🧠 Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            console.log("🧼 Clearing auth state...");

            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token"); // ✅
            sessionStorage.removeItem("user");  // ✅
            disconnectSocket(); // 👈 disconnect on logout
            // ... reset state
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔄 Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                const { token, user } = action.payload;
                state.isAuthenticated = true;
                state.token = token;
                state.user = user;
                state.isLoading = false;
            })
            .addCase(login.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.isLoading = false;
            })

            // ✅ Register
            .addCase(RegisterThunk.fulfilled, (state, action) => {
                const { token, user } = action.payload;
                state.isAuthenticated = true;
                state.token = token;
                state.user = user;
                state.isLoading = false;
            })

            // 🔄 Session check
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log("✅ checkAuth success:", action.payload);
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.isLoading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
