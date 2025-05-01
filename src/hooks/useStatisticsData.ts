
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { bookService } from '../services/bookService';
import { stageService } from '../services/stageService';
import { taskService } from '../services/taskService';
import { Book } from '../services/bookService';
import { Stage } from '../services/stageService';
import { Task } from '../services/taskService';

export interface StatisticsData {
  books: Book[];
  allStages: Stage[];
  allTasks: Task[];
  isLoading: boolean;
}

export const useStatisticsData = (): StatisticsData => {
  const { toast } = useToast();
  
  // Get all books data
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookService.getBooks,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load books data",
          variant: "destructive",
        });
        console.error('Error loading books:', error);
      }
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
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load stages data",
          variant: "destructive",
        });
        console.error('Error loading stages:', error);
      }
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
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to load tasks data",
          variant: "destructive",
        });
        console.error('Error loading tasks:', error);
      }
    }
  });

  const isLoading = booksLoading || stagesLoading || tasksLoading;

  return { books, allStages, allTasks, isLoading };
};
