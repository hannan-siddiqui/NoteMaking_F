'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import { useAuth } from '@/lib/auth-context';
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context';
import { api } from '@/lib/api';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isLoading, activeWorkspace } = useAuth();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [isLoading, token, router]);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewNote = async (parentId?: string | null) => {
    try {
      const note = await api.createNote({
        title: 'Untitled',
        icon: '📝',
        parentId: parentId || null,
        workspaceId: activeWorkspace?.id || null,
      });
      router.push(`/app/notes/${note.id}`);
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#131316]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">Loading Notion Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#131316]">
      {/* Mobile backdrop overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Hierarchical Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNewNote={handleNewNote}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </div>

      {/* Global Quick Search Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNewPage={() => handleNewNote(null)}
      />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
