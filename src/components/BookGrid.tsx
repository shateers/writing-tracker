
import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import BookProgress from './BookProgress';

interface Book {
  id: string;
  title: string;
  isSelected?: boolean;
  progress?: number;
  isCompleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface BookGridProps {
  books: Book[];
  onBookSelect: (bookId: string) => void;
  onCreateNew: () => void;
  onUpdateBook?: (bookId: string, newTitle: string) => void;
  onDeleteBook?: (bookId: string) => void;
  onReorderBooks?: (sourceIndex: number, destinationIndex: number) => void;
}

const BookGrid = ({ 
  books, 
  onBookSelect, 
  onCreateNew, 
  onUpdateBook, 
  onDeleteBook,
  onReorderBooks 
}: BookGridProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    if (onUpdateBook) {
      setEditingId(book.id);
      setEditValue(book.title);
    }
  };

  const handleSave = (bookId: string) => {
    if (onUpdateBook && editValue.trim()) {
      onUpdateBook(bookId, editValue);
    }
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (onDeleteBook) {
      onDeleteBook(bookId);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingId) {
      handleSave(editingId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderBooks) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      onReorderBooks(sourceIndex, destinationIndex);
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
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="books" direction="horizontal">
            {(provided) => (
              <div 
                className="contents" 
                {...provided.droppableProps} 
                ref={provided.innerRef}
              >
                {books.map((book, index) => (
                  <Draggable 
                    key={book.id} 
                    draggableId={book.id} 
                    index={index}
                    isDragDisabled={editingId === book.id}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          gridColumn: snapshot.isDragging ? 'span 1' : undefined,
                        }}
                      >
                        <Card
                          className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors relative group ${
                            book.isCompleted ? 'bg-green-100 border-green-500' : ''
                          } ${book.isSelected ? 'border-2 border-black' : ''} ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                          onClick={() => {
                            if (!snapshot.isDragging) {
                              setTimeout(() => onBookSelect(book.id), 150);
                            }
                          }}
                        >
                          <div 
                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 cursor-move"
                            {...provided.dragHandleProps}
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                          
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
                                <h3 className="text-lg font-medium break-words mt-3">
                                  {book.title}
                                </h3>
                              )}
                              {book.isCompleted && (
                                <div className="rounded-full bg-green-500 p-1">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            {book.progress !== undefined && book.created_at && book.updated_at && (
                              <BookProgress 
                                progress={book.progress} 
                                createdAt={book.created_at} 
                                updatedAt={book.updated_at}
                              />
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BookGrid;
