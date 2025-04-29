
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { taskService, Task } from '../../services/taskService';

interface TaskMutationsProps {
  stageId: string;
  bookId: string | undefined;
  children: (mutations: {
    createTask: (title: string) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;
    reorderTasks: (tasks: Task[], sourceIndex: number, destinationIndex: number) => void;
    toggleTask: (taskId: string, tasks: Task[]) => void;
  }) => React.ReactNode;
}

const TaskMutations: React.FC<TaskMutationsProps> = ({ stageId, bookId, children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTaskMutation = useMutation({
    mutationFn: (title: string) => taskService.createTask(stageId, title),
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      console.error('Error creating task:', error);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => 
      taskService.updateTask(id, updates),
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      console.error('Error updating task:', error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      console.error('Error deleting task:', error);
    },
  });

  const reorderTasksMutation = useMutation({
    mutationFn: ({ tasks, sourceIndex, destinationIndex }: { 
      tasks: Task[]; 
      sourceIndex: number; 
      destinationIndex: number 
    }) => taskService.reorderTasks(tasks, sourceIndex, destinationIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', stageId] });
      toast({
        title: "Success",
        description: "Tasks reordered successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reorder tasks",
        variant: "destructive",
      });
      console.error('Error reordering tasks:', error);
    },
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks', stageId] });
    queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
    queryClient.invalidateQueries({ queryKey: ['books'] });
  };

  const handleTaskToggle = (taskId: string, tasks: Task[]) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({ 
        id: taskId, 
        updates: { is_completed: !task.is_completed } 
      });
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ id: taskId, updates });
  };

  const handleCreateTask = (title: string) => {
    createTaskMutation.mutate(title);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleReorderTasks = (tasks: Task[], sourceIndex: number, destinationIndex: number) => {
    reorderTasksMutation.mutate({ tasks, sourceIndex, destinationIndex });
  };

  return (
    <>
      {children({
        createTask: handleCreateTask,
        updateTask: handleUpdateTask,
        deleteTask: handleDeleteTask,
        reorderTasks: handleReorderTasks,
        toggleTask: handleTaskToggle
      })}
    </>
  );
};

export default TaskMutations;
