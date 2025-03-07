import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="w-5 h-5 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Olá, João</h1>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};