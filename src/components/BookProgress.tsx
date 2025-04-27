
import React from 'react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookProgressProps {
  progress: number;
  createdAt: string;
  updatedAt: string;
}

const BookProgress = ({ progress, createdAt, updatedAt }: BookProgressProps) => {
  // Generate sample progress data for the mini chart
  const generateProgressData = () => {
    const startDate = new Date(createdAt);
    const endDate = new Date();
    const days = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const dataPoints = Math.min(days, 7); // Show up to 7 data points

    const data = [];
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - (dataPoints - i - 1));
      
      // Generate somewhat realistic progress data
      const dayProgress = Math.min(100, Math.max(0, 
        i === dataPoints - 1 
          ? progress 
          : Math.floor(progress * (i / dataPoints) + Math.random() * 10)
      ));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        progress: dayProgress
      });
    }
    return data;
  };

  const progressData = generateProgressData();
  
  // Calculate estimated completion time based on progress rate
  const calculateEstimatedCompletion = () => {
    if (progress >= 100) return 'Completed';
    if (progress <= 0) return 'Not started';
    
    const startDate = new Date(createdAt);
    const currentDate = new Date();
    const updatedDate = new Date(updatedAt);
    
    const daysPassed = Math.max(1, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const progressPerDay = progress / daysPassed;
    
    if (progressPerDay <= 0) return 'Unknown';
    
    const daysRemaining = Math.ceil((100 - progress) / progressPerDay);
    
    if (daysRemaining < 1) return 'Soon';
    if (daysRemaining === 1) return 'Tomorrow';
    if (daysRemaining < 7) return `${daysRemaining} days`;
    if (daysRemaining < 30) return `${Math.ceil(daysRemaining / 7)} weeks`;
    return `${Math.ceil(daysRemaining / 30)} months`;
  };

  // Determine status color
  const getStatusColor = () => {
    if (progress >= 100) return 'text-green-500 bg-green-50';
    if (progress > 0) return 'text-yellow-500 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const estimatedCompletion = calculateEstimatedCompletion();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16">
          <CircularProgress value={progress} size="medium" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Progress value={progress} className={`h-2 ${getProgressColor()}`} />
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className={cn("px-2 py-1 text-xs rounded-full flex items-center gap-1", getStatusColor())}>
          <Clock className="h-3 w-3" />
          <span>{estimatedCompletion}</span>
        </div>
      </div>
      
      <div className="h-24 w-full">
        <ChartContainer
          config={{
            progress: {
              label: "Progress",
              theme: {
                light: "#8B5CF6",
                dark: "#8B5CF6",
              },
            },
          }}
        >
          <LineChart data={progressData}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              hide={true}
              domain={[0, 100]} 
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: "#d1d5db" }}
            />
            <Line 
              type="monotone" 
              dataKey="progress" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4, stroke: '#C4B5FD', strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BookProgress;
