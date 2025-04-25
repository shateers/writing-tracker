
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import StageList from '../components/StageList';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const Stages = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [stages, setStages] = useState([
    { id: 1, title: "Stage 1 (Idea)", isCompleted: true, progress: 100 },
    { id: 2, title: "Stage 2 (First Draft)", isCompleted: false, progress: 60 },
    { id: 3, title: "Stage 3 (Editing)", isCompleted: false, progress: 30 },
    { id: 4, title: "Stage 4 (Marketing)", isCompleted: false, progress: 0 },
  ]);

  // Calculate book progress based on stages and update the parent book
  useEffect(() => {
    const totalStages = stages.length;
    const completedStages = stages.filter(stage => stage.isCompleted).length;
    const overallProgress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;
    
    // In a real app, this would update the book's progress in a database or global state
    console.log(`Book ${bookId} progress: ${overallProgress}%`);
  }, [stages, bookId]);

  const handleStageSelect = (stageId: number) => {
    navigate(`/books/${bookId}/stages/${stageId}/tasks`);
  };

  const handleCreateStage = () => {
    const newId = Math.max(...stages.map(s => s.id), 0) + 1;
    const newStage = {
      id: newId,
      title: `Stage ${newId}`,
      isCompleted: false,
      progress: 0
    };
    setStages([...stages, newStage]);
  };

  const handleUpdateStage = (stageId: number, newTitle: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, title: newTitle } : stage
    ));
  };

  const handleDeleteStage = (stageId: number) => {
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const handleToggleComplete = (stageId: number) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, isCompleted: !stage.isCompleted } : stage
    ));
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
                <BreadcrumbLink>Book {bookId} Stages</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/books')}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </Button>
          <Button onClick={handleCreateStage} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Stage
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Book Stages</h1>
        <div className="bg-white rounded-lg shadow">
          <StageList 
            stages={stages}
            onStageSelect={handleStageSelect}
            onUpdateStage={handleUpdateStage}
            onToggleComplete={handleToggleComplete}
            onDeleteStage={handleDeleteStage}
          />
        </div>
      </div>
    </div>
  );
};

export default Stages;
