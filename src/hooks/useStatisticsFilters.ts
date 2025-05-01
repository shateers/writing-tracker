
import { useState } from 'react';
import { Book } from '../services/bookService';

export type FilterPeriod = 'all' | 'month' | 'week' | 'day';
export type SortOption = 'name' | 'progress' | 'date';

interface StatisticsFilters {
  period: FilterPeriod;
  sortBy: SortOption;
  showCompleted: boolean;
}

export const useStatisticsFilters = (initialBooks: Book[]) => {
  const [filters, setFilters] = useState<StatisticsFilters>({
    period: 'all',
    sortBy: 'progress',
    showCompleted: true,
  });

  const filteredBooks = initialBooks.filter(book => {
    // Filter by completion status
    if (!filters.showCompleted && book.is_completed) {
      return false;
    }
    
    // Filter by time period
    if (filters.period !== 'all') {
      const bookDate = new Date(book.updated_at);
      const now = new Date();
      
      if (filters.period === 'day') {
        // Last 24 hours
        return (now.getTime() - bookDate.getTime()) < 24 * 60 * 60 * 1000;
      } else if (filters.period === 'week') {
        // Last 7 days
        return (now.getTime() - bookDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
      } else if (filters.period === 'month') {
        // Last 30 days
        return (now.getTime() - bookDate.getTime()) < 30 * 24 * 60 * 60 * 1000;
      }
    }
    
    return true;
  });
  
  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (filters.sortBy === 'name') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    } else if (filters.sortBy === 'date') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    return 0;
  });

  return {
    filters,
    setFilters,
    filteredBooks: sortedBooks,
  };
};
