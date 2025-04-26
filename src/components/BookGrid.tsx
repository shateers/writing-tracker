
import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Book {
  id: string; // Changed from number to string
  title: string;
  isSelected?: boolean;
  progress?: number;
  isCompleted?: boolean;
}

interface BookGridProps {
  books: Book[];
  onBookSelect: (bookId: string) => void; // Changed from number to string
  onCreateNew: () => void;
  onUpdateBook?: (bookId: string, newTitle: string) => void; // Changed from number to string
  onDeleteBook?: (bookId: string) => void; // Changed from number to string
}

const BookGrid = ({ books, onBookSelect, onCreateNew, onUpdateBook, onDeleteBook }: BookGridProps) => {
  const [editingId, setEditingId] = useState<string | null>(null); // Changed from number to string
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // Stop click from triggering navigation
    if (onUpdateBook) {
      setEditingId(book.id);
      setEditValue(book.title);
    }
  };

  const handleSave = (bookId: string) => { // Changed from number to string
    if (onUpdateBook && editValue.trim()) {
      onUpdateBook(bookId, editValue);
    }
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, bookId: string) => { // Changed from number to string
    e.stopPropagation();
    if (onDeleteBook) {
      onDeleteBook(bookId);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card onClick from firing
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingId) {
      handleSave(editingId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
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
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors relative group ${
              book.isCompleted ? 'bg-green-100 border-green-500' : ''
            } ${book.isSelected ? 'border-2 border-black' : ''}`}
            onClick={() => {
              // Add a slight delay to navigation to allow edit buttons to work
              setTimeout(() => onBookSelect(book.id), 150);
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                {editingId === book.id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(book.id)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1"
                    onClick={handleInputClick}
                  />
                ) : (
                  <h3 className="text-lg font-medium break-words">
                    {book.title}
                  </h3>
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
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200"
                onClick={(e) => handleEditStart(e, book)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {onDeleteBook && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleDelete(e, book.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
