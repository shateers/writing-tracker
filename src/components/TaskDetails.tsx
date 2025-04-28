
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Link } from 'lucide-react';
import type { Task, TaskReference } from '../services/taskService';

interface TaskDetailsProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onUpdateTask }) => {
  const handleDescriptionChange = (value?: string) => {
    onUpdateTask(task.id, { description: value || '' });
  };

  const handleAddReference = () => {
    const newReference: TaskReference = {
      type: 'link',
      title: 'New Reference',
      url: ''
    };
    const updatedReferences = [...(task.task_references || []), newReference];
    onUpdateTask(task.id, { task_references: updatedReferences });
  };

  const handleUpdateReference = (index: number, updates: Partial<TaskReference>) => {
    const updatedReferences = [...(task.task_references || [])];
    updatedReferences[index] = { ...updatedReferences[index], ...updates };
    onUpdateTask(task.id, { task_references: updatedReferences });
  };

  const handleRemoveReference = (index: number) => {
    const updatedReferences = [...(task.task_references || [])];
    updatedReferences.splice(index, 1);
    onUpdateTask(task.id, { task_references: updatedReferences });
  };

  return (
    <div className="space-y-4 p-4">
      <div data-color-mode="light">
        <MDEditor
          value={task.description || ''}
          onChange={handleDescriptionChange}
          preview="edit"
          height={200}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">References</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddReference}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Reference
          </Button>
        </div>
        
        <div className="space-y-3">
          {task.task_references?.map((reference, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={reference.title}
                    onChange={(e) => handleUpdateReference(index, { title: e.target.value })}
                    placeholder="Reference title"
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={reference.url}
                    onChange={(e) => handleUpdateReference(index, { url: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveReference(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
