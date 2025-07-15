import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const res = await api.get("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(res);
  
  return res.data; // Array of Task objects
});

interface Task {
  id: number;
  title: string;
  createdAt: string;
  // etc.
}

interface TaskState {
  list: Task[];
  isLoading: boolean;
}

const initialState: TaskState = {
  list: [],
  isLoading: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default taskSlice.reducer;
