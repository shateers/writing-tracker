
import { supabase } from "@/integrations/supabase/client";

export interface Book {
  id: string;
  title: string;
  progress: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const bookService = {
  async getBooks() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createBook(title: string) {
    const { data, error } = await supabase
      .from('books')
      .insert([{ title }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBook(id: string, updates: Partial<Book>) {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteBook(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
