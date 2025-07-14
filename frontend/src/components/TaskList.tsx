import React from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

interface Props {
  tasks: Task[];
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="p-2 bg-white shadow rounded">
          <span>{task.title}</span>
          {task.completed && <span className="ml-2 text-green-600">✔️</span>}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
