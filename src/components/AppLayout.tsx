
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <SidebarProvider defaultOpen={!collapsed} onOpenChange={setCollapsed}>
      <div className="min-h-screen flex w-full bg-zinc-50 dark:bg-zinc-950">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 h-16 bg-white dark:bg-zinc-900 border-b border-border flex items-center px-6">
            <div className="flex-1 text-lg font-semibold">
              MotoLocadora Manager
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
