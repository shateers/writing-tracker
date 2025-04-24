
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
  onUpdateTask?: (taskId: number, newTitle: string) => void;
}

const TaskList = ({ tasks, onTaskToggle, onUpdateTask }: TaskListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (task: Task) => {
    if (onUpdateTask) {
      setEditingId(task.id);
      setEditValue(task.title);
    }
  };

  const handleSave = (taskId: number) => {
    if (onUpdateTask) {
      onUpdateTask(taskId, editValue);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
          onDoubleClick={() => handleDoubleClick(task)}
        >
          {editingId === task.id ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave(task.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave(task.id);
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="flex-1 mr-4"
            />
          ) : (
            <span className="text-sm">{task.title}</span>
          )}
          <div 
            className="w-6 h-6 flex items-center justify-center"
            onClick={() => onTaskToggle(task.id)}
          >
            {task.isCompleted ? (
              <div className="rounded-full bg-green-500 p-1">
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
