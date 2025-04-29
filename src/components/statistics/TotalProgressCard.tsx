
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Book } from "../../services/bookService";
import { Stage } from "../../services/stageService";
import { Task } from "../../services/taskService";
import { BookOpen, CheckCircle } from "lucide-react";

interface TotalProgressCardProps {
  books: Book[];
  stages: Stage[];
  tasks: Task[];
}

const TotalProgressCard = ({ books, stages, tasks }: TotalProgressCardProps) => {
  // Calculate statistics
  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.is_completed).length;
  const averageBookProgress = Math.round(
    books.reduce((sum, book) => sum + (book.progress || 0), 0) / Math.max(totalBooks, 1)
  );
  
  const totalStages = stages.length;
  const completedStages = stages.filter(s => s.is_completed).length;
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const taskCompletionRate = Math.round((completedTasks / Math.max(totalTasks, 1)) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-primary" />
            Book Overview
          </CardTitle>
          <CardDescription>Total books and completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center">
              <CircularProgress value={averageBookProgress} maxValue={100} className="h-24 w-24" />
              <p className="mt-2 text-sm text-muted-foreground">Average Progress</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Total Books</p>
                <p className="text-2xl font-bold">{totalBooks}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{completedBooks} <span className="text-sm text-muted-foreground">of {totalBooks}</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            Stages Progress
          </CardTitle>
          <CardDescription>Stage completion across all books</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Completed Stages</span>
                <span className="text-sm font-medium">{completedStages}/{totalStages}</span>
              </div>
              <Progress value={Math.round((completedStages / Math.max(totalStages, 1)) * 100)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm font-medium">Total Stages</p>
                <p className="text-2xl font-bold">{totalStages}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round((completedStages / Math.max(totalStages, 1)) * 100)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            Tasks Completion
          </CardTitle>
          <CardDescription>Task completion across all stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Completed Tasks</span>
                <span className="text-sm font-medium">{completedTasks}/{totalTasks}</span>
              </div>
              <Progress value={taskCompletionRate} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">{taskCompletionRate}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalProgressCard;
