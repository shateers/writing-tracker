
import { supabase } from "@/integrations/supabase/client";

export interface Book {
  id: string;
  title: string;
  progress: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  order_position: number;
}

export const bookService = {
  async getBooks() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('order_position', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createBook(title: string) {
    // Get the maximum order position and add 1 for the new book
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('books')
      .select('order_position')
      .order('order_position', { ascending: false })
      .limit(1);
    
    if (maxOrderError) throw maxOrderError;
    
    const newOrderPosition = (maxOrderData && maxOrderData.length > 0) 
      ? maxOrderData[0].order_position + 1 
      : 1;
    
    const { data, error } = await supabase
      .from('books')
      .insert([{ 
        title, 
        order_position: newOrderPosition 
      }])
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
  },
  
  async reorderBooks(books: Book[], sourceIndex: number, destinationIndex: number) {
    // Create a copy of the books array
    const reorderedBooks = [...books];
    
    // Remove the book from the source index and insert it at the destination index
    const [removedBook] = reorderedBooks.splice(sourceIndex, 1);
    reorderedBooks.splice(destinationIndex, 0, removedBook);
    
    // Update the order_position for all affected books
    const updates = reorderedBooks.map((book, index) => ({
      id: book.id,
      title: book.title,
      order_position: index + 1  // Use 1-based indexing for order
    }));
    
    // Update all books in a single transaction
    const { error } = await supabase
      .from('books')
      .upsert(updates, { onConflict: 'id' });
    
    if (error) throw error;
    return reorderedBooks;
  }
};
