
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "../../services/bookService";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingDown, TrendingUp } from "lucide-react";

interface ProgressComparisonChartProps {
  books: Book[];
}

const ProgressComparisonChart = ({ books }: ProgressComparisonChartProps) => {
  const chartData = React.useMemo(() => {
    // Format data for the chart
    return books.map(book => ({
      name: book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title,
      Progress: book.progress || 0,
      Completed: book.is_completed ? 100 : 0,
      id: book.id,
      fullTitle: book.title,
    }));
  }, [books]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Book Progress Comparison
        </CardTitle>
        <CardDescription>
          Compare progress across all your books
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ChartContainer 
            config={{
              "Progress": {
                color: "#6366f1", // indigo-500
              },
              "Completed": {
                color: "#22c55e", // green-500
              },
            }}
          >
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={150} tickLine={false} />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-bold">{data.fullTitle}</div>
                        <div className="text-xs text-muted-foreground">
                          {payload.map((entry, index) => (
                            <div key={`tooltip-${index}`} className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{`${entry.name}: ${entry.value}%`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="Progress" 
                fill="#6366f1" 
                radius={[4, 4, 4, 4]} 
                barSize={20} 
              />
              <ChartLegend 
                content={<ChartLegendContent />} 
                verticalAlign="top"
              />
            </BarChart>
          </ChartContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-indigo-50 rounded-lg flex items-start">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-indigo-900">High Progress Books</h3>
              <p className="text-sm text-indigo-700 mt-1">
                {books.filter(b => (b.progress || 0) > 75).length} books have progress above 75%
              </p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg flex items-start">
            <TrendingDown className="h-5 w-5 text-amber-600 mr-2 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-amber-900">Low Progress Books</h3>
              <p className="text-sm text-amber-700 mt-1">
                {books.filter(b => (b.progress || 0) < 25).length} books have progress below 25%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressComparisonChart;
