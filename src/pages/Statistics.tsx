
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TotalProgressCard from '../components/statistics/TotalProgressCard';
import CompletionTrendChart from '../components/statistics/CompletionTrendChart';
import MostActiveItemsList from '../components/statistics/MostActiveItemsList';
import ProgressComparisonChart from '../components/statistics/ProgressComparisonChart';
import PeriodProgressSummary from '../components/statistics/PeriodProgressSummary';
import StatisticsFilters from '../components/statistics/StatisticsFilters';
import { OverviewSkeleton, ChartSkeleton, TableSkeleton } from '../components/statistics/StatisticsSkeleton';
import AppNavigation from '../components/AppNavigation';
import { useStatisticsData } from '@/hooks/useStatisticsData';
import { useStatisticsFilters } from '@/hooks/useStatisticsFilters';

const Statistics = () => {
  const { books, allStages, allTasks, isLoading } = useStatisticsData();
  
  const { 
    filters, 
    setFilters, 
    filteredBooks 
  } = useStatisticsFilters(books);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-4">Dashboard Statistics</h1>
        
        <StatisticsFilters 
          period={filters.period}
          sortBy={filters.sortBy}
          showCompleted={filters.showCompleted}
          onChangePeriod={(period) => setFilters(prev => ({ ...prev, period }))}
          onChangeSortBy={(sortBy) => setFilters(prev => ({ ...prev, sortBy }))}
          onChangeShowCompleted={(showCompleted) => setFilters(prev => ({ ...prev, showCompleted }))}
        />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {isLoading ? (
              <OverviewSkeleton />
            ) : (
              <TotalProgressCard books={filteredBooks} stages={allStages} tasks={allTasks} />
            )}
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <CompletionTrendChart books={filteredBooks} />
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <MostActiveItemsList stages={allStages} tasks={allTasks} />
            )}
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ProgressComparisonChart books={filteredBooks} />
            )}
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <PeriodProgressSummary books={filteredBooks} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <AppNavigation />
    </div>
  );
};

export default Statistics;
