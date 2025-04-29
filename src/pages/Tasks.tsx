
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskList from '../components/TaskList';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { taskService, Task } from '../services/taskService';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const Tasks = () => {
  const navigate = useNavigate();
  const { bookId, stageId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (!stageId) {
    return <div>Stage ID is missing</div>;
  }

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', stageId],
    queryFn: () => taskService.getTasks(stageId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (title: string) => taskService.createTask(stageId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', stageId] });
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
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
      queryClient.invalidateQueries({ queryKey: ['tasks', stageId] });
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
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
      queryClient.invalidateQueries({ queryKey: ['tasks', stageId] });
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
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

  const handleTaskToggle = (taskId: string) => {
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

  const handleCreateTask = () => {
    createTaskMutation.mutate(`New Task`);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleReorderTasks = (sourceIndex: number, destinationIndex: number) => {
    if (tasks) {
      reorderTasksMutation.mutate({ tasks, sourceIndex, destinationIndex });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/books">Books</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/books/${bookId}/stages`}>Stages</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Tasks</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/books/${bookId}/stages`)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Stages
          </Button>
          <Button onClick={handleCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Stage Tasks</h1>
        <div className="bg-white rounded-lg shadow">
          <TaskList 
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
