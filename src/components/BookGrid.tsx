
import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

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
  onDeleteBook?: (bookId: number) => void;
}

const BookGrid = ({ books, onBookSelect, onCreateNew, onUpdateBook, onDeleteBook }: BookGridProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (book: Book) => {
    if (onUpdateBook) {
      setEditingId(book.id);
      setEditValue(book.title);
    }
  };

  const handleSave = (bookId: number) => {
    if (onUpdateBook && editValue.trim()) {
      onUpdateBook(bookId, editValue);
    }
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation();
    if (onDeleteBook) {
      onDeleteBook(bookId);
    }
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
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors relative ${
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
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:opacity-100"
              onClick={(e) => handleDelete(e, book.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
