import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../api/axios";

interface AuthState {
    isAuthenticated: boolean;
    user: { email: string; role: string } | null;
    token: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true, // ✅ must be TRUE to show "Checking session..."
};

export const checkAuth = createAsyncThunk<
    { token: string; user: { email: string; role: string } }, // ✅ correct payload shape
    void,
    { rejectValue: string }
>("auth/checkAuth", async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
        return { token, user: JSON.parse(user) };
    }

    return thunkAPI.rejectWithValue("No token found");
});


export const RegisterThunk = createAsyncThunk(
    "auth/register",
    async ({ email, password }: { email: string; password: string },) => {
        const res = await api.post("/auth/register", { email, password });
        localStorage.setItem("token", res.data.access_token);
        return res.data;
    });


export const DashboardThunk = createAsyncThunk(
    "auth/dashboard",
    async() => {
        const token = localStorage.getItem("token");
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

// 🔑 Login API
export const login = createAsyncThunk<
    { token: string; email: string; role: string },
    { email: string; password: string },
    { rejectValue: string }
>("auth/login", async (credentials, thunkAPI) => {
    try {
        const res = await api.post("/auth/login", credentials);
        const token = res.data.access_token;
        const email = res.data.user.email;
        const role = res.data.user.role;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ email, role }));

        return { token, email, role };
    } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Login failed"
        );
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔄 Login flow
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                const { token, email, role } = action.payload;
                state.isAuthenticated = true;
                state.token = token;
                state.user = { email, role };
                state.isLoading = false;
            })
            .addCase(login.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.isLoading = false;
            })

            // 🔄 Auth check on refresh
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
                state.isLoading = false; // ✅ Needed here too
            }).addCase(RegisterThunk.fulfilled, (state, action) => {
                const { token, email, role } = action.payload;
                state.isAuthenticated = true;
                state.token = token;
                state.user = { email, role };
                state.isLoading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
