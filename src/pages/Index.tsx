
import React, { useState } from 'react';
import BookGrid from '../components/BookGrid';
import StageList from '../components/StageList';
import TaskList from '../components/TaskList';

const Index = () => {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  const books = [
    { id: 1, title: "Book 1" },
    { id: 2, title: "Book 2" },
    { id: 3, title: "Book 3" },
    { id: 4, title: "Book 4" },
    { id: 5, title: "Book 5" },
  ];

  const stages = [
    { id: 1, title: "Stage 1 (Idea)", isCompleted: true },
    { id: 2, title: "Stage 2 (First Draft)", isCompleted: false },
    { id: 3, title: "Stage 3 (Editing)", isCompleted: false },
    { id: 4, title: "Stage 4 (Marketing)", isCompleted: false },
  ];

  const tasks = [
    { id: 1, title: "Brainstorm core concept", isCompleted: true },
    { id: 2, title: "Develop character sketches", isCompleted: false },
    { id: 3, title: "Create rough outline", isCompleted: false },
    { id: 4, title: "Set timeline goals", isCompleted: false },
  ];

  const handleBookSelect = (bookId: number) => {
    setSelectedBookId(bookId);
    setSelectedStageId(null);
  };

  const handleStageSelect = (stageId: number) => {
    setSelectedStageId(stageId);
  };

  const handleCreateNew = () => {
    // Implement book creation logic
    console.log("Create new book clicked");
  };

  const handleTaskToggle = (taskId: number) => {
    // Implement task toggle logic
    console.log("Toggle task:", taskId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-8">Book Writing Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow">
            <BookGrid 
              books={books.map(book => ({
                ...book,
                isSelected: book.id === selectedBookId
              }))}
              onBookSelect={handleBookSelect}
              onCreateNew={handleCreateNew}
            />
          </div>
          {selectedBookId && (
            <div className="bg-white rounded-lg shadow">
              <StageList 
                stages={stages}
                onStageSelect={handleStageSelect}
              />
            </div>
          )}
          {selectedStageId && (
            <div className="bg-white rounded-lg shadow">
              <TaskList 
                tasks={tasks}
                onTaskToggle={handleTaskToggle}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
