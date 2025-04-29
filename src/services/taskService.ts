
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface TaskReference {
  type: 'link' | 'file';
  title: string;
  url: string;
}

export interface Task {
  id: string;
  stage_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  order_position: number;
  task_references: TaskReference[] | null;
  created_at: string;
  updated_at: string;
}

export const taskService = {
  async getTasks(stageId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('stage_id', stageId)
      .order('order_position', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(task => ({
      ...task,
      task_references: task.task_references as unknown as TaskReference[] | null
    })) as Task[];
  },

  async createTask(stageId: string, title: string) {
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('order_position')
      .eq('stage_id', stageId)
      .order('order_position', { ascending: false })
      .limit(1);

    const newPosition = existingTasks?.[0]?.order_position ?? 0;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        stage_id: stageId, 
        title, 
        order_position: newPosition + 1,
        description: '',
        task_references: []
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      task_references: data.task_references as unknown as TaskReference[] | null
    } as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    // Create a new object with all properties except task_references
    const { task_references, ...otherUpdates } = updates;
    
    // Prepare the updates for Supabase
    const supabaseUpdates: any = { ...otherUpdates };
    
    // Only add task_references if it's defined in the updates
    if (task_references !== undefined) {
      supabaseUpdates.task_references = task_references as unknown as Json;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      task_references: data.task_references as unknown as TaskReference[] | null
    } as Task;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async reorderTasks(tasks: Task[], sourceIndex: number, destinationIndex: number) {
    const reorderedTasks = [...tasks];
    
    const [removedTask] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destinationIndex, 0, removedTask);
    
    const updates = reorderedTasks.map((task, index) => ({
      id: task.id,
      title: task.title,
      order_position: index + 1
    }));
    
    const { error } = await supabase
      .from('tasks')
      .upsert(updates, { onConflict: 'id' });
    
    if (error) throw error;
    return reorderedTasks;
  }
};
