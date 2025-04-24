
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import TaskList from '../components/TaskList';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

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

    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    
    const allCompleted = updatedTasks.every(task => task.isCompleted);
    
    toast({
      title: "Task status updated",
      description: allCompleted ? 
        "All tasks completed! Stage is now complete." : 
        "The task completion status has been updated.",
    });
  };

  const handleUpdateTask = (taskId: number, newTitle: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
    toast({
      title: "Task updated",
      description: "The task title has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/books/${bookId}/stages`)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Stages
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Stage Tasks</h1>
        <div className="bg-white rounded-lg shadow">
          <TaskList 
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
