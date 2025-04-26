
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BookGrid from '../components/BookGrid';
import { bookService } from '../services/bookService';
import { useToast } from "@/components/ui/use-toast";

const Books = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookService.getBooks,
  });

  const createBookMutation = useMutation({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Book created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create book",
        variant: "destructive",
      });
      console.error('Error creating book:', error);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      bookService.updateBook(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Book updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      });
      console.error('Error updating book:', error);
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: bookService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
      console.error('Error deleting book:', error);
    },
  });

  const reorderBooksMutation = useMutation({
    mutationFn: ({ books, sourceIndex, destinationIndex }: { 
      books: any[]; 
      sourceIndex: number; 
      destinationIndex: number 
    }) => bookService.reorderBooks(books, sourceIndex, destinationIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Books reordered successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reorder books",
        variant: "destructive",
      });
      console.error('Error reordering books:', error);
    },
  });

  const handleBookSelect = (bookId: string) => {
    navigate(`/books/${bookId}/stages`);
  };

  const handleCreateNew = () => {
    createBookMutation.mutate("New Book");
  };

  const handleUpdateBook = (bookId: string, newTitle: string) => {
    updateBookMutation.mutate({ id: bookId, updates: { title: newTitle } });
  };

  const handleDeleteBook = (bookId: string) => {
    deleteBookMutation.mutate(bookId);
  };

  const handleReorderBooks = (sourceIndex: number, destinationIndex: number) => {
    reorderBooksMutation.mutate({ books, sourceIndex, destinationIndex });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-8">Book Writing Tracker</h1>
        <BookGrid 
          books={books}
          onBookSelect={handleBookSelect}
          onCreateNew={handleCreateNew}
          onUpdateBook={handleUpdateBook}
          onDeleteBook={handleDeleteBook}
          onReorderBooks={handleReorderBooks}
        />
      </div>
    </div>
  );
};

export default Books;
