
import React from 'react';
import TaskList from '../TaskList';
import { Task } from '../../services/taskService';

interface TaskContainerProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks: (sourceIndex: number, destinationIndex: number) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  tasks,
  onTaskToggle,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <TaskList 
        tasks={tasks}
        onTaskToggle={onTaskToggle}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onReorderTasks={onReorderTasks}
      />
    </div>
  );
};

export default TaskContainer;
