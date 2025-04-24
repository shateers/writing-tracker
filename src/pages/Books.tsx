
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookGrid from '../components/BookGrid';

const Books = () => {
  const navigate = useNavigate();
  const books = [
    { id: 1, title: "Book 1" },
    { id: 2, title: "Book 2" },
    { id: 3, title: "Book 3" },
    { id: 4, title: "Book 4" },
    { id: 5, title: "Book 5" },
  ];

  const handleBookSelect = (bookId: number) => {
    navigate(`/books/${bookId}/stages`);
  };

  const handleCreateNew = () => {
    console.log("Create new book clicked");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-8">Book Writing Tracker</h1>
        <BookGrid 
          books={books}
          onBookSelect={handleBookSelect}
          onCreateNew={handleCreateNew}
        />
      </div>
    </div>
  );
};

export default Books;
