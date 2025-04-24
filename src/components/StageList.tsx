
import React from 'react';
import { Check, X } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface StageListProps {
  stages: Stage[];
  onStageSelect: (stageId: number) => void;
}

const StageList = ({ stages, onStageSelect }: StageListProps) => {
  return (
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-semibold mb-4">Stages</h2>
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onStageSelect(stage.id)}
        >
          <span className="text-sm">{stage.title}</span>
          <div className="w-6 h-6 flex items-center justify-center">
            {stage.isCompleted ? (
              <div className="rounded-full bg-black p-1">
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
