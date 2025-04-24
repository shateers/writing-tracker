
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import TaskList from '../components/TaskList';
import { Button } from '@/components/ui/button';

const Tasks = () => {
  const navigate = useNavigate();
  const { bookId, stageId } = useParams();

  const tasks = [
    { id: 1, title: "Brainstorm core concept", isCompleted: true },
    { id: 2, title: "Develop character sketches", isCompleted: false },
    { id: 3, title: "Create rough outline", isCompleted: false },
    { id: 4, title: "Set timeline goals", isCompleted: false },
  ];

  const handleTaskToggle = (taskId: number) => {
    console.log("Toggle task:", taskId);
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
          <TaskList tasks={tasks} onTaskToggle={handleTaskToggle} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
