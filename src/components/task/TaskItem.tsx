
import React, { useState } from 'react';
import { Check, X, Trash2, Edit, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Draggable } from 'react-beautiful-dnd';
import TaskDetails from '../TaskDetails';
import type { Task } from '../../services/taskService';

interface TaskItemProps {
  task: Task;
  index: number;
  onTaskToggle: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onTaskToggle,
  onUpdateTask,
  onDeleteTask,
  expandedTaskId,
  setExpandedTaskId
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateTask(task.id, { title: editValue });
    }
    setEditingId(null);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex flex-col rounded-lg border cursor-pointer transition-colors relative group ${
            task.is_completed ? 'bg-green-100 border-green-300' : 'bg-white'
          } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
        >
          <div className="flex items-center justify-between p-4">
            <div {...provided.dragHandleProps} className="mr-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1 mr-4">
              {editingId === task.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  onClick={handleInputClick}
                />
              ) : (
                <span 
                  className={`text-sm ${task.is_completed ? 'line-through text-gray-500' : ''}`}
                  onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                >
                  {task.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={() => onTaskToggle(task.id)}
              >
                {task.is_completed ? (
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
                  onClick={handleEditStart}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          {expandedTaskId === task.id && (
            <TaskDetails
              task={task}
              onUpdateTask={onUpdateTask}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
