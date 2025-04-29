import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StageList from '../components/StageList';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { stageService, Stage } from '../services/stageService';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import AppNavigation from '../components/AppNavigation';

const Stages = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (!bookId) {
    return <div>Book ID is missing</div>;
  }

  const { data: stages = [], isLoading } = useQuery({
    queryKey: ['stages', bookId],
    queryFn: () => stageService.getStages(bookId),
  });

  const createStageMutation = useMutation({
    mutationFn: (title: string) => stageService.createStage(bookId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Stage created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create stage",
        variant: "destructive",
      });
      console.error('Error creating stage:', error);
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Stage> }) => 
      stageService.updateStage(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Stage updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update stage",
        variant: "destructive",
      });
      console.error('Error updating stage:', error);
    },
  });

  const deleteStageMutation = useMutation({
    mutationFn: stageService.deleteStage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Stage deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete stage",
        variant: "destructive",
      });
      console.error('Error deleting stage:', error);
    },
  });

  const reorderStagesMutation = useMutation({
    mutationFn: ({ stages, sourceIndex, destinationIndex }: { 
      stages: Stage[]; 
      sourceIndex: number; 
      destinationIndex: number 
    }) => stageService.reorderStages(stages, sourceIndex, destinationIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages', bookId] });
      toast({
        title: "Success",
        description: "Stages reordered successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reorder stages",
        variant: "destructive",
      });
      console.error('Error reordering stages:', error);
    },
  });

  const handleStageSelect = (stageId: string) => {
    navigate(`/books/${bookId}/stages/${stageId}/tasks`);
  };

  const handleCreateStage = () => {
    createStageMutation.mutate(`New Stage`);
  };

  const handleUpdateStage = (stageId: string, newTitle: string) => {
    updateStageMutation.mutate({ id: stageId, updates: { title: newTitle } });
  };

  const handleDeleteStage = (stageId: string) => {
    deleteStageMutation.mutate(stageId);
  };

  const handleToggleComplete = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      updateStageMutation.mutate({ 
        id: stageId, 
        updates: { is_completed: !stage.is_completed } 
      });
    }
  };

  const handleReorderStages = (sourceIndex: number, destinationIndex: number) => {
    if (stages) {
      reorderStagesMutation.mutate({ stages, sourceIndex, destinationIndex });
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
                <BreadcrumbLink>Book Stages</BreadcrumbLink>
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
            onReorderStages={handleReorderStages}
          />
        </div>
      </div>
      <AppNavigation />
    </div>
  );
};

export default Stages;
