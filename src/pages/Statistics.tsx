
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../services/bookService';
import { stageService } from '../services/stageService';
import { taskService } from '../services/taskService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TotalProgressCard from '../components/statistics/TotalProgressCard';
import CompletionTrendChart from '../components/statistics/CompletionTrendChart';
import MostActiveItemsList from '../components/statistics/MostActiveItemsList';
import ProgressComparisonChart from '../components/statistics/ProgressComparisonChart';
import PeriodProgressSummary from '../components/statistics/PeriodProgressSummary';
import { useToast } from "@/hooks/use-toast";

const Statistics = () => {
  const { toast } = useToast();
  
  // Get all books data
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookService.getBooks,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load books data",
        variant: "destructive",
      });
      console.error('Error loading books:', error);
    }
  });

  // Get all stages data (from all books)
  const { data: allStages = [], isLoading: stagesLoading } = useQuery({
    queryKey: ['allStages'],
    queryFn: async () => {
      // Get stages for all books
      const bookIds = books.map(book => book.id);
      const stagesPromises = bookIds.map(bookId => stageService.getStages(bookId));
      const stagesResults = await Promise.all(stagesPromises);
      // Flatten the array of arrays into a single array of stages
      return stagesResults.flat();
    },
    enabled: books.length > 0,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load stages data",
        variant: "destructive",
      });
      console.error('Error loading stages:', error);
    }
  });

  // Get tasks for the most active stages
  const { data: allTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['allTasks'],
    queryFn: async () => {
      // Get the top 5 stages (or fewer if there are less than 5)
      const topStageIds = allStages.slice(0, 5).map(stage => stage.id);
      const tasksPromises = topStageIds.map(stageId => taskService.getTasks(stageId));
      const tasksResults = await Promise.all(tasksPromises);
      // Flatten the array of arrays into a single array of tasks
      return tasksResults.flat();
    },
    enabled: allStages.length > 0,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load tasks data",
        variant: "destructive",
      });
      console.error('Error loading tasks:', error);
    }
  });

  const isLoading = booksLoading || stagesLoading || tasksLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading statistics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard Statistics</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <TotalProgressCard books={books} stages={allStages} tasks={allTasks} />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <CompletionTrendChart books={books} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <MostActiveItemsList stages={allStages} tasks={allTasks} />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <ProgressComparisonChart books={books} />
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <PeriodProgressSummary books={books} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
