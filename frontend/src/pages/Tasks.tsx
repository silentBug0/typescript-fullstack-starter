// src/pages/Tasks.tsx
import { useEffect, useState } from "react";
import socket from "../socket";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  // 🔄 Fetch initial tasks
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  // 🔔 Listen for taskCreated event
  useEffect(() => {
    socket.on("taskCreated", (newTask: Task) => {
      setTasks((prev) => [...prev, newTask]);
    });

    return () => {
      socket.off("taskCreated");
    };
  }, []);

  // ➕ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-2 border rounded bg-white shadow-sm flex justify-between"
          >
            <span>{task.title}</span>
            <span>{task.completed ? "✅" : "🕒"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
