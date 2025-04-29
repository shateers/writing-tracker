
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, ChartBar } from "lucide-react";

const AppNavigation = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg z-50">
      <div className="flex items-center justify-center p-2">
        <Link to="/books">
          <Button 
            variant={location.pathname.includes('/books') ? "default" : "ghost"} 
            size="sm" 
            className="rounded-full px-4"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Books
          </Button>
        </Link>
        <Link to="/statistics">
          <Button 
            variant={location.pathname === '/statistics' ? "default" : "ghost"} 
            size="sm" 
            className="rounded-full px-4"
          >
            <ChartBar className="h-4 w-4 mr-1" />
            Statistics
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AppNavigation;
