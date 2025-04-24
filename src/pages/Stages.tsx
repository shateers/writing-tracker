
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import StageList from '../components/StageList';
import { Button } from '@/components/ui/button';

const Stages = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const stages = [
    { id: 1, title: "Stage 1 (Idea)", isCompleted: true },
    { id: 2, title: "Stage 2 (First Draft)", isCompleted: false },
    { id: 3, title: "Stage 3 (Editing)", isCompleted: false },
    { id: 4, title: "Stage 4 (Marketing)", isCompleted: false },
  ];

  const handleStageSelect = (stageId: number) => {
    navigate(`/books/${bookId}/stages/${stageId}/tasks`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Books
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Book Stages</h1>
        <div className="bg-white rounded-lg shadow">
          <StageList stages={stages} onStageSelect={handleStageSelect} />
        </div>
      </div>
    </div>
  );
};

export default Stages;
