
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookGrid from '../components/BookGrid';
import { toast } from '@/hooks/use-toast';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = React.useState([
    { id: 1, title: "Book 1", progress: 75 },
    { id: 2, title: "Book 2", progress: 30 },
    { id: 3, title: "Book 3", progress: 0 },
    { id: 4, title: "Book 4", progress: 50 },
    { id: 5, title: "Book 5", progress: 10 },
  ]);

  const handleBookSelect = (bookId: number) => {
    navigate(`/books/${bookId}/stages`);
  };

  const handleCreateNew = () => {
    const newId = Math.max(...books.map(b => b.id)) + 1;
    setBooks([...books, { id: newId, title: `New Book ${newId}`, progress: 0 }]);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-8">Book Writing Tracker</h1>
        <BookGrid 
          books={books}
          onBookSelect={handleBookSelect}
          onCreateNew={handleCreateNew}
          onUpdateBook={handleUpdateBook}
        />
      </div>
    </div>
  );
};

export default Books;
