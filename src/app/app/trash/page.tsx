'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  RotateCcw,
  Search,
  X,
  AlertTriangle,
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';

export default function TrashPage() {
  const router = useRouter();
  const [trashNotes, setTrashNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadTrash = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTrash();
      setTrashNotes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await api.restoreNote(id);
      setTrashNotes((prev) => prev.filter((n) => n.id !== id));
      router.push(`/app/notes/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePermanent = async (id: string) => {
    try {
      await api.deletePermanently(id);
      setTrashNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm('Are you sure you want to permanently delete all notes in Trash? This action cannot be undone.')) {
      return;
    }
    try {
      await api.emptyTrash();
      setTrashNotes([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = trashNotes.filter((n) =>
    (n.title || 'Untitled').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#131316] select-none">
      <Topbar note={null} />

      <div className="max-w-4xl w-full mx-auto px-6 py-8 sm:px-12 sm:py-10 space-y-6 animate-pop-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-200/70 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                Trash & Archives
              </h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Restoring a note moves it back to your workspace hierarchy. Permanent deletion destroys records completely.
            </p>
          </div>

          {trashNotes.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Trash ({trashNotes.length})</span>
            </button>
          )}
        </div>

        {/* Search filter in trash */}
        {trashNotes.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deleted pages by title..."
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50/60 dark:bg-white/[0.03] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* List of Trash items */}
        {isLoading ? (
          <div className="py-16 text-center text-xs text-gray-400">
            Loading trash notes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.04] text-gray-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Trash is empty
            </div>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Deleted or archived pages will appear here. You can restore them anytime.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:bg-gray-50/60 dark:hover:bg-white/[0.04] transition-all shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{note.icon || '📝'}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {note.title || 'Untitled'}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">
                      Archived on {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRestore(note.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => handleDeletePermanent(note.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Forever</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
