
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookGrid from '../components/BookGrid';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = React.useState([
    { id: 1, title: "Book 1", progress: 75, isCompleted: false },
    { id: 2, title: "Book 2", progress: 30, isCompleted: false },
    { id: 3, title: "Book 3", progress: 0, isCompleted: false },
    { id: 4, title: "Book 4", progress: 50, isCompleted: true },
    { id: 5, title: "Book 5", progress: 10, isCompleted: false },
  ]);

  const handleBookSelect = (bookId: number) => {
    navigate(`/books/${bookId}/stages`);
  };

  const handleCreateNew = () => {
    const newId = Math.max(...books.map(b => b.id), 0) + 1;
    const newBook = { 
      id: newId, 
      title: `New Book ${newId}`, 
      progress: 0, 
      isCompleted: false 
    };
    setBooks([...books, newBook]);
    toast({
      title: "Book created",
      description: "A new book has been added to your list.",
    });
  };

  const handleUpdateBook = (bookId: number, newTitle: string) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, title: newTitle } : book
    ));
    toast({
      title: "Book updated",
      description: "The book title has been updated.",
    });
  };

  const handleDeleteBook = (bookId: number) => {
    setBooks(books.filter(book => book.id !== bookId));
    toast({
      title: "Book deleted",
      description: "The book has been removed from your list.",
    });
  };

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
        />
      </div>
    </div>
  );
};

export default Books;
