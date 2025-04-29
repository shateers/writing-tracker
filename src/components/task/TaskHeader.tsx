
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

interface TaskHeaderProps {
  bookId: string | undefined;
  onCreateTask: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ bookId, onCreateTask }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/books">Books</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/books/${bookId}/stages`}>Stages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Tasks</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/books/${bookId}/stages`)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Stages
        </Button>
        <Button onClick={onCreateTask} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">Stage Tasks</h1>
    </>
  );
};

export default TaskHeader;
