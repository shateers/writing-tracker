
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { taskService, Task } from '../services/taskService';
import TaskHeader from '../components/task/TaskHeader';
import TaskContainer from '../components/task/TaskContainer';
import TaskMutations from '../components/task/TaskMutations';

const Tasks = () => {
  const { bookId, stageId } = useParams();

  if (!stageId) {
    return <div>Stage ID is missing</div>;
  }

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', stageId],
    queryFn: () => taskService.getTasks(stageId),
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <TaskMutations stageId={stageId} bookId={bookId}>
          {({ createTask, updateTask, deleteTask, reorderTasks, toggleTask }) => (
            <>
              <TaskHeader 
                bookId={bookId} 
                onCreateTask={() => createTask("New Task")} 
              />
              <TaskContainer
                tasks={tasks}
                onTaskToggle={(taskId) => toggleTask(taskId, tasks)}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onReorderTasks={(sourceIndex, destinationIndex) => 
                  reorderTasks(tasks, sourceIndex, destinationIndex)
                }
              />
            </>
          )}
        </TaskMutations>
      </div>
    </div>
  );
};

export default Tasks;
