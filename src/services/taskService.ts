import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  stage_id: string;
  title: string;
  is_completed: boolean;
  order_position: number;
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
    return data;
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
        order_position: newPosition + 1 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
