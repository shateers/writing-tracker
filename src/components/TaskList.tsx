
import React from 'react';
import { Check, X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
}

const TaskList = ({ tasks, onTaskToggle }: TaskListProps) => {
  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onTaskToggle(task.id)}
        >
          <span className="text-sm">{task.title}</span>
          <div className="w-6 h-6 flex items-center justify-center">
            {task.isCompleted ? (
              <div className="rounded-full bg-black p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="rounded-full bg-red-500 p-1">
                <X className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
