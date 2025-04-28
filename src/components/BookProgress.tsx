
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { formatDistanceToNow } from 'date-fns';

interface BookProgressProps {
  progress: number;
  createdAt: string;
  updatedAt: string;
}

const BookProgress = ({ progress, createdAt, updatedAt }: BookProgressProps) => {
  const getStatusColor = (progress: number): string => {
    if (progress === 0) return 'text-red-500';
    if (progress === 100) return 'text-green-500';
    if (progress < 30) return 'text-red-400';
    if (progress < 70) return 'text-amber-400';
    return 'text-green-400';
  };

  // Calculate estimated completion time based on progress rate
  const calculateEstimatedCompletion = () => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    
    // If progress is 0% or 100%, we don't need to estimate
    if (progress === 0) return "Not started yet";
    if (progress === 100) return "Complete";
    
    // Calculate days elapsed since creation
    const daysSinceCreation = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate daily progress rate
    const progressRate = progress / daysSinceCreation;
    
    // Days remaining based on current progress rate
    const daysRemaining = progressRate > 0 ? Math.ceil((100 - progress) / progressRate) : 0;
    
    // Get estimated completion date
    if (progressRate <= 0 || daysRemaining > 365) {
      return "Unknown";
    }
    
    const estimatedCompletionDate = new Date();
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + daysRemaining);
    
    return `~${formatDistanceToNow(estimatedCompletionDate, { addSuffix: true })}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CircularProgress 
            value={progress} 
            size="small" 
            colorClass={getStatusColor(progress)}
          />
          <div className="ml-3 space-y-1">
            <div className="text-sm font-medium">{progress}% Complete</div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <span>Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <div className={`text-sm font-medium ${getStatusColor(progress)}`}>
          {progress === 0 && "Not started"}
          {progress > 0 && progress < 100 && "In progress"}
          {progress === 100 && "Completed"}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Progress 
          value={progress} 
          className="h-2"
        />
        <div className="ml-4 text-xs text-gray-500">
          Est. completion: {calculateEstimatedCompletion()}
        </div>
      </div>
    </div>
  );
};

export default BookProgress;
