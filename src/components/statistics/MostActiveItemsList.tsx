
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stage } from "../../services/stageService";
import { Task } from "../../services/taskService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface MostActiveItemsListProps {
  stages: Stage[];
  tasks: Task[];
}

const MostActiveItemsList = ({ stages, tasks }: MostActiveItemsListProps) => {
  // Calculate activity score for stages (based on task completion and progress)
  const activeStages = React.useMemo(() => {
    return stages
      .map(stage => ({
        ...stage,
        activityScore: (stage.progress || 0) + (stage.is_completed ? 100 : 0),
      }))
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, 5); // Top 5 most active stages
  }, [stages]);

  // Calculate active tasks (most recently updated or with highest order position)
  const activeTasks = React.useMemo(() => {
    return tasks
      .sort((a, b) => {
        // Sort by updated_at date (most recent first)
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateB - dateA;
      })
      .slice(0, 5); // Top 5 most recently updated tasks
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Most Active Stages
          </CardTitle>
          <CardDescription>
            Stages with the highest progress and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeStages.length > 0 ? (
                activeStages.map((stage) => (
                  <TableRow key={stage.id}>
                    <TableCell className="font-medium">{stage.title}</TableCell>
                    <TableCell>{stage.progress || 0}%</TableCell>
                    <TableCell>
                      {stage.is_completed ? (
                        <Badge variant="default" className="bg-green-500">Completed</Badge>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No active stages found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Recently Active Tasks
          </CardTitle>
          <CardDescription>
            Tasks with the most recent updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTasks.length > 0 ? (
                activeTasks.map((task) => {
                  const date = new Date(task.updated_at);
                  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                  
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>
                        {task.is_completed ? (
                          <Badge variant="default" className="bg-green-500">Completed</Badge>
                        ) : (
                          <Badge variant="outline">In Progress</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No active tasks found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MostActiveItemsList;
