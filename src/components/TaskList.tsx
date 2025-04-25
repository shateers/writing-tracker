
import React, { useState } from 'react';
import { Check, X, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
  onUpdateTask?: (taskId: number, newTitle: string) => void;
  onDeleteTask?: (taskId: number) => void;
}

const TaskList = ({ tasks, onTaskToggle, onUpdateTask, onDeleteTask }: TaskListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (onUpdateTask) {
      setEditingId(task.id);
      setEditValue(task.title);
    }
  };

  const handleSave = (taskId: number) => {
    if (onUpdateTask && editValue.trim()) {
      onUpdateTask(taskId, editValue);
    }
    setEditingId(null);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent div onClick from firing
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingId) {
      handleSave(editingId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors relative group ${
            task.isCompleted ? 'bg-green-100' : 'bg-white'
          }`}
        >
          {editingId === task.id ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave(task.id)}
              onKeyDown={handleKeyDown}
              autoFocus
              onClick={handleInputClick}
              className="flex-1 mr-4"
            />
          ) : (
            <span 
              className="text-sm flex-1"
            >
              {task.title}
            </span>
          )}
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onTaskToggle(task.id);
              }}
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
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleEditStart(e, task)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              {onDeleteTask && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => handleDelete(e, task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
