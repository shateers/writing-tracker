
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskItem from './task/TaskItem';
import type { Task } from '../services/taskService';

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks?: (sourceIndex: number, destinationIndex: number) => void;
}

const TaskList = ({ 
  tasks, 
  onTaskToggle, 
  onUpdateTask, 
  onDeleteTask,
  onReorderTasks 
}: TaskListProps) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onReorderTasks) return;
    onReorderTasks(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onTaskToggle={onTaskToggle}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  expandedTaskId={expandedTaskId}
                  setExpandedTaskId={setExpandedTaskId}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
