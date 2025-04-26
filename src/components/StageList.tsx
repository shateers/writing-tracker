
import React, { useState } from 'react';
import { Check, X, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Stage {
  id: string; // Changed from number to string
  title: string;
  isCompleted?: boolean;
  is_completed?: boolean; // Added to match Supabase schema
  progress?: number;
}

interface StageListProps {
  stages: Stage[];
  onStageSelect: (stageId: string) => void; // Changed from number to string
  onUpdateStage?: (stageId: string, newTitle: string) => void; // Changed from number to string
  onToggleComplete?: (stageId: string) => void; // Changed from number to string
  onDeleteStage?: (stageId: string) => void; // Changed from number to string
}

const StageList = ({ stages, onStageSelect, onUpdateStage, onToggleComplete, onDeleteStage }: StageListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null); // Changed from number to string
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (e: React.MouseEvent, stage: Stage) => {
    e.stopPropagation();
    if (onUpdateStage) {
      setEditingId(stage.id);
      setEditValue(stage.title);
    }
  };

  const handleSave = (stageId: string) => { // Changed from number to string
    if (onUpdateStage && editValue.trim()) {
      onUpdateStage(stageId, editValue);
    }
    setEditingId(null);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent div onClick from firing
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingId) {
      handleSave(editingId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, stageId: string) => { // Changed from number to string
    e.stopPropagation();
    if (onDeleteStage) {
      onDeleteStage(stageId);
    }
  };

  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Stages</h2>
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors relative group ${
            (stage.isCompleted || stage.is_completed) ? 'bg-green-100' : 'bg-white'
          }`}
          onClick={() => {
            // Add a slight delay to navigation to allow edit buttons to work
            setTimeout(() => onStageSelect(stage.id), 150);
          }}
        >
          <div className="flex-1 mr-4">
            {editingId === stage.id ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(stage.id)}
                onKeyDown={handleKeyDown}
                autoFocus
                onClick={handleInputClick}
              />
            ) : (
              <span className="text-sm">
                {stage.title}
              </span>
            )}
            {stage.progress !== undefined && (
              <Progress value={stage.progress} className="h-2 mt-2" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleComplete) {
                  onToggleComplete(stage.id);
                }
              }}
            >
              {(stage.isCompleted || stage.is_completed) ? (
                <div className="rounded-full bg-green-500 p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="rounded-full bg-red-500 p-1">
                  <X className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleEditStart(e, stage)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDelete(e, stage.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StageList;
