
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

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
}

const StageList = ({ stages, onStageSelect, onUpdateStage, onToggleComplete }: StageListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (stage: Stage) => {
    if (onUpdateStage) {
      setEditingId(stage.id);
      setEditValue(stage.title);
    }
  };

  const handleSave = (stageId: number) => {
    if (onUpdateStage) {
      onUpdateStage(stageId, editValue);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Stages</h2>
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
            stage.isCompleted ? 'bg-green-100' : 'bg-white'
          }`}
          onClick={() => onStageSelect(stage.id)}
          onDoubleClick={() => handleDoubleClick(stage)}
        >
          <div className="flex-1 mr-4">
            {editingId === stage.id ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(stage.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave(stage.id);
                  }
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm">{stage.title}</span>
            )}
            {stage.progress !== undefined && (
              <Progress value={stage.progress} className="h-2 mt-2" />
            )}
          </div>
          <div 
            className="w-6 h-6 flex items-center justify-center"
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
        </div>
      ))}
    </div>
  );
};

export default StageList;
