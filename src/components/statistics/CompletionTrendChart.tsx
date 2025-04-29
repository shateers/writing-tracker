
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "../../services/bookService";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartLine } from "lucide-react";

interface CompletionTrendChartProps {
  books: Book[];
}

const CompletionTrendChart = ({ books }: CompletionTrendChartProps) => {
  // For demo purposes, let's create some synthetic trend data based on created_at dates
  // In a real app, you would have historical progress data stored in the database
  const generateTrendData = () => {
    // Sort books by creation date
    const sortedBooks = [...books].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Create trend data points - one per book creation date
    const trendData = sortedBooks.map((book, index) => {
      // Calculate cumulative progress up to this book
      const booksUntilNow = sortedBooks.slice(0, index + 1);
      const completedBooksCount = booksUntilNow.filter(b => b.is_completed).length;
      const averageProgress = booksUntilNow.reduce((sum, b) => sum + (b.progress || 0), 0) / booksUntilNow.length;
      
      // Format date for display
      const date = new Date(book.created_at);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      
      return {
        name: formattedDate,
        "Average Progress": Math.round(averageProgress),
        "Completion Rate": Math.round((completedBooksCount / booksUntilNow.length) * 100),
      };
    });
    
    return trendData;
  };

  const trendData = generateTrendData();

  // If there's only one data point, add a starting point at 0 for visualization purposes
  if (trendData.length === 1) {
    const firstDate = new Date(books[0].created_at);
    // Create a date 1 week before
    const prevDate = new Date(firstDate);
    prevDate.setDate(prevDate.getDate() - 7);
    const formattedPrevDate = `${prevDate.getMonth() + 1}/${prevDate.getDate()}/${prevDate.getFullYear()}`;
    
    trendData.unshift({
      name: formattedPrevDate,
      "Average Progress": 0,
      "Completion Rate": 0,
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <ChartLine className="mr-2 h-5 w-5 text-primary" />
          Completion Trends Over Time
        </CardTitle>
        <CardDescription>
          Book progress and completion rates since you started tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer 
            config={{
              "Average Progress": {
                color: "#4f46e5", // indigo-600
              },
              "Completion Rate": {
                color: "#16a34a", // green-600
              },
            }}
          >
            <LineChart 
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Line 
                type="monotone" 
                dataKey="Average Progress" 
                stroke="#4f46e5" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Completion Rate" 
                stroke="#16a34a" 
              />
            </LineChart>
          </ChartContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-900">Average Progress</h3>
            <p className="text-sm text-indigo-700 mt-1">
              The average progress percentage across all books over time.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Completion Rate</h3>
            <p className="text-sm text-green-700 mt-1">
              The percentage of books that have been marked as completed over time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionTrendChart;
