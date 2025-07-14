import { useEffect, useState } from "react";
import { getSocket } from "../socket";
import axios from "axios";
import {  useAppSelector } from "../store/hooks";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user?: {
    name: string;
  };
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`, {
      data: {
        userId: auth.user?.id ?? 0, // Use the logged-in user's ID
      },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const socket = getSocket();

      socket?.emit("getTasks");

      const handleAllTasks = (allTasks: Task[]) => setTasks(allTasks);
      const handleTaskCreated = (newTask: Task) => {
        setTasks((prev) => {
          const exists = prev.some((task) => task.id === newTask.id);
          return exists ? prev : [...prev, newTask];
        });
      };
      const handleTaskUpdated = (updatedTask: Task) => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t
          )
        );
      };
      const handleTaskDeleted = (deletedId: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== deletedId));
      };

      socket?.on("tasks", handleAllTasks);
      socket?.on("taskCreated", handleTaskCreated);
      socket?.on("taskUpdated", handleTaskUpdated);
      socket?.on("taskDeleted", handleTaskDeleted);

      return () => {
        socket?.off("tasks", handleAllTasks);
        socket?.off("taskCreated", handleTaskCreated);
        socket?.off("taskUpdated", handleTaskUpdated);
        socket?.off("taskDeleted", handleTaskDeleted);
      };
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      await axios.put(`http://localhost:3000/tasks/${editingTask.id}`, {
        title,
        userId: auth.user?.id ?? 0, // Use the logged-in user's ID
      });
      setEditingTask(null);
    } else {
      await axios.post("http://localhost:3000/tasks", {
        title,
        userId: auth.user?.id ?? 0, // Use the logged-in user's ID
      });
    }

    setTitle("");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">📝 Tasks</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add or edit task"
          className="border rounded px-2 py-1 w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded">
          {editingTask ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded p-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={async () => {
                  await axios.put(`http://localhost:3000/tasks/${task.id}`, {
                    completed: !task.completed,
                    userId: task.userId,
                  });
                }}
              />
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
                {task.user?.name && (
                  <span className="text-sm text-gray-400 ml-2">
                    ({task.user.name})
                  </span>
                )}
              </span>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
