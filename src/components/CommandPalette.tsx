'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Plus,
  Trash2,
  Moon,
  Sun,
  LogOut,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewPage: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNewPage,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.searchNotes(query);
        setResults(res || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Static action items
  const actions = [
    {
      id: 'action-new',
      label: 'Create new page',
      icon: <Plus className="w-4 h-4 text-emerald-500" />,
      run: () => {
        onClose();
        onNewPage();
      },
    },
    {
      id: 'action-trash',
      label: 'Open Trash & Archived Notes',
      icon: <Trash2 className="w-4 h-4 text-amber-500" />,
      run: () => {
        onClose();
        router.push('/app/trash');
      },
    },
    {
      id: 'action-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon:
        theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-400" />
        ),
      run: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: 'action-logout',
      label: 'Sign Out of Notion Workspace',
      icon: <LogOut className="w-4 h-4 text-red-500" />,
      run: () => {
        onClose();
        logout();
      },
    },
  ];

  const totalItems = query.trim() ? results.length : actions.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim() && results[selectedIndex]) {
        router.push(`/app/notes/${results[selectedIndex].id}`);
        onClose();
      } else if (!query.trim() && actions[selectedIndex]) {
        actions[selectedIndex].run();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden animate-pop-in">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-200/70 dark:border-white/[0.06]">
          <Search className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, jump to note, or trigger action..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[10px] text-gray-400 border border-gray-200 dark:border-white/[0.08] rounded-md bg-gray-100 dark:bg-white/[0.04] font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results or Actions List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {isLoading && (
            <div className="py-8 text-center text-xs text-gray-400">
              Searching notes database...
            </div>
          )}

          {!isLoading && query.trim() && results.length === 0 && (
            <div className="py-10 text-center text-xs text-gray-400">
              No matching pages found for &quot;{query}&quot;
            </div>
          )}

          {/* Searched Notes Results */}
          {!isLoading && query.trim() && results.length > 0 && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                Matching Notes ({results.length})
              </div>
              {results.map((note, index) => (
                <button
                  key={note.id}
                  onClick={() => {
                    router.push(`/app/notes/${note.id}`);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                    selectedIndex === index
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base shrink-0">{note.icon || '📝'}</span>
                    <span className="truncate">{note.title || 'Untitled'}</span>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 opacity-40 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {!query.trim() && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                Quick Actions
              </div>
              {actions.map((act, index) => (
                <button
                  key={act.id}
                  onClick={act.run}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                    selectedIndex === index
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {act.icon}
                    <span>{act.label}</span>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="px-1 border border-gray-200 dark:border-white/[0.08] rounded">↑</kbd> <kbd className="px-1 border border-gray-200 dark:border-white/[0.08] rounded">↓</kbd></span>
            <span>Select <kbd className="px-1 border border-gray-200 dark:border-white/[0.08] rounded">↵</kbd></span>
          </div>
          <span>Quick Switcher</span>
        </div>
      </div>
    </div>
  );
}
