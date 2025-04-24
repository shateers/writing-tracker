
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import StageList from '../components/StageList';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Stages = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [stages, setStages] = useState([
    { id: 1, title: "Stage 1 (Idea)", isCompleted: true, progress: 100 },
    { id: 2, title: "Stage 2 (First Draft)", isCompleted: false, progress: 60 },
    { id: 3, title: "Stage 3 (Editing)", isCompleted: false, progress: 30 },
    { id: 4, title: "Stage 4 (Marketing)", isCompleted: false, progress: 0 },
  ]);

  const handleStageSelect = (stageId: number) => {
    navigate(`/books/${bookId}/stages/${stageId}/tasks`);
  };

  const handleUpdateStage = (stageId: number, newTitle: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, title: newTitle } : stage
    ));
    toast({
      title: "Stage updated",
      description: "The stage title has been updated.",
    });
  };

  const handleToggleComplete = (stageId: number) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, isCompleted: !stage.isCompleted } : stage
    ));
    toast({
      title: "Stage status updated",
      description: "The stage completion status has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/books')}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Book Stages</h1>
        <div className="bg-white rounded-lg shadow">
          <StageList 
            stages={stages}
            onStageSelect={handleStageSelect}
            onUpdateStage={handleUpdateStage}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default Stages;
