import { supabase } from "@/integrations/supabase/client";

export interface Stage {
  id: string;
  book_id: string;
  title: string;
  progress: number;
  is_completed: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export const stageService = {
  async getStages(bookId: string) {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .eq('book_id', bookId)
      .order('order_position', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createStage(bookId: string, title: string) {
    const { data: existingStages } = await supabase
      .from('stages')
      .select('order_position')
      .eq('book_id', bookId)
      .order('order_position', { ascending: false })
      .limit(1);

    const newPosition = existingStages?.[0]?.order_position ?? 0;

    const { data, error } = await supabase
      .from('stages')
      .insert([{ 
        book_id: bookId, 
        title, 
        order_position: newPosition + 1 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStage(id: string, updates: Partial<Stage>) {
    const { data, error } = await supabase
      .from('stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteStage(id: string) {
    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async reorderStages(stages: Stage[], sourceIndex: number, destinationIndex: number) {
    const reorderedStages = [...stages];
    
    const [removedStage] = reorderedStages.splice(sourceIndex, 1);
    reorderedStages.splice(destinationIndex, 0, removedStage);
    
    const updates = reorderedStages.map((stage, index) => ({
      id: stage.id,
      title: stage.title,
      order_position: index + 1
    }));
    
    const { error } = await supabase
      .from('stages')
      .upsert(updates, { onConflict: 'id' });
    
    if (error) throw error;
    return reorderedStages;
  }
};
