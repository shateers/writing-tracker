
import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Book {
  id: number;
  title: string;
  isSelected?: boolean;
}

interface BookGridProps {
  books: Book[];
  onBookSelect: (bookId: number) => void;
  onCreateNew: () => void;
}

const BookGrid = ({ books, onBookSelect, onCreateNew }: BookGridProps) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card 
          className="p-6 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onCreateNew}
        >
          <div className="text-center">
            <Plus className="mx-auto mb-2" />
            <span className="text-sm">Create New</span>
          </div>
        </Card>
        {books.map((book) => (
          <Card
            key={book.id}
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
              book.isSelected ? 'border-2 border-black' : ''
            }`}
            onClick={() => onBookSelect(book.id)}
          >
            <h3 className="text-lg font-medium">{book.title}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
