
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, Calendar, ArrowDownUp } from "lucide-react";
import { FilterPeriod, SortOption } from '@/hooks/useStatisticsFilters';

interface StatisticsFiltersProps {
  period: FilterPeriod;
  sortBy: SortOption;
  showCompleted: boolean;
  onChangePeriod: (period: FilterPeriod) => void;
  onChangeSortBy: (sortBy: SortOption) => void;
  onChangeShowCompleted: (show: boolean) => void;
}

const StatisticsFilters = ({
  period,
  sortBy,
  showCompleted,
  onChangePeriod,
  onChangeSortBy,
  onChangeShowCompleted
}: StatisticsFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {period === 'all' ? 'All Time' :
               period === 'month' ? 'Last 30 Days' :
               period === 'week' ? 'Last 7 Days' :
               'Last 24 Hours'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Time Period</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => onChangePeriod('all')}>
              <span className={period === 'all' ? 'font-bold' : ''}>All Time</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangePeriod('month')}>
              <span className={period === 'month' ? 'font-bold' : ''}>Last 30 Days</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangePeriod('week')}>
              <span className={period === 'week' ? 'font-bold' : ''}>Last 7 Days</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangePeriod('day')}>
              <span className={period === 'day' ? 'font-bold' : ''}>Last 24 Hours</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowDownUp className="h-4 w-4" />
            <span>
              {sortBy === 'name' ? 'Sort: Name' :
               sortBy === 'progress' ? 'Sort: Progress' : 'Sort: Date'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => onChangeSortBy('name')}>
              <span className={sortBy === 'name' ? 'font-bold' : ''}>Name</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangeSortBy('progress')}>
              <span className={sortBy === 'progress' ? 'font-bold' : ''}>Progress</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangeSortBy('date')}>
              <span className={sortBy === 'date' ? 'font-bold' : ''}>Date</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showCompleted}
            onCheckedChange={onChangeShowCompleted}
          >
            Show Completed
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatisticsFilters;
