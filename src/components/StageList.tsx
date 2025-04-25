
import React, { useState } from 'react';
import { Check, X, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Stage {
  id: number;
  title: string;
  isCompleted: boolean;
  progress?: number;
}

interface StageListProps {
  stages: Stage[];
  onStageSelect: (stageId: number) => void;
  onUpdateStage?: (stageId: number, newTitle: string) => void;
  onToggleComplete?: (stageId: number) => void;
  onDeleteStage?: (stageId: number) => void;
}

const StageList = ({ stages, onStageSelect, onUpdateStage, onToggleComplete, onDeleteStage }: StageListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (e: React.MouseEvent, stage: Stage) => {
    e.stopPropagation();
    if (onUpdateStage) {
      setEditingId(stage.id);
      setEditValue(stage.title);
    }
  };

  const handleSave = (stageId: number) => {
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

  const handleDelete = (e: React.MouseEvent, stageId: number) => {
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
            stage.isCompleted ? 'bg-green-100' : 'bg-white'
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
              {stage.isCompleted ? (
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
