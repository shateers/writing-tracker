
import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Book {
  id: number;
  title: string;
  isSelected?: boolean;
  progress?: number;
  isCompleted?: boolean;
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
              book.isCompleted ? 'bg-green-100 border-green-500' : ''
            } ${book.isSelected ? 'border-2 border-black' : ''}`}
            onClick={() => onBookSelect(book.id)}
            onDoubleClick={() => handleDoubleClick(book)}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
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
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3 className="text-lg font-medium">{book.title}</h3>
                )}
                {book.isCompleted && (
                  <div className="rounded-full bg-green-500 p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              {book.progress !== undefined && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round(book.progress)}%</span>
                  </div>
                  <Progress value={book.progress} className="h-2" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
