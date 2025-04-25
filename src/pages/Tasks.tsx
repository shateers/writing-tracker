
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import TaskList from '../components/TaskList';
import { Button } from '@/components/ui/button';
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
  const [tasks, setTasks] = useState([
    { id: 1, title: "Brainstorm core concept", isCompleted: true },
    { id: 2, title: "Develop character sketches", isCompleted: false },
    { id: 3, title: "Create rough outline", isCompleted: false },
    { id: 4, title: "Set timeline goals", isCompleted: false },
  ]);

  // Calculate stage progress based on tasks
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const stageProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const isStageCompleted = stageProgress === 100;
    
    // In a real app, this would update the stage's progress in a database or global state
    console.log(`Stage ${stageId} progress: ${stageProgress}%, completed: ${isStageCompleted}`);
  }, [tasks, stageId]);

  const handleTaskToggle = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const handleUpdateTask = (taskId: number, newTitle: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
  };

  const handleCreateTask = () => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const newTask = {
      id: newId,
      title: `Task ${newId}`,
      isCompleted: false
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

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
                <BreadcrumbLink>Stage {stageId} Tasks</BreadcrumbLink>
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
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
