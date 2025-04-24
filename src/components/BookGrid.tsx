
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Book {
  id: number;
  title: string;
  isSelected?: boolean;
  progress?: number;
}

interface BookGridProps {
  books: Book[];
  onBookSelect: (bookId: number) => void;
  onCreateNew: () => void;
  onUpdateBook?: (bookId: number, newTitle: string) => void;
}

const BookGrid = ({ books, onBookSelect, onCreateNew, onUpdateBook }: BookGridProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (book: Book) => {
    setEditingId(book.id);
    setEditValue(book.title);
  };

  const handleSave = (bookId: number) => {
    if (onUpdateBook) {
      onUpdateBook(bookId, editValue);
    }
    setEditingId(null);
  };

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
            onDoubleClick={() => handleDoubleClick(book)}
          >
            <div className="space-y-4">
              {editingId === book.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSave(book.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave(book.id);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <h3 className="text-lg font-medium">{book.title}</h3>
              )}
              {book.progress !== undefined && (
                <Progress value={book.progress} className="h-2" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
