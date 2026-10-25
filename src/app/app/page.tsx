'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Clock,
  Star,
  FileText,
  Sparkles,
  Database,
  ShieldCheck,
  Search,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const router = useRouter();
  const { user, activeWorkspace } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getNotes({ workspaceId: activeWorkspace?.id })
      .then((data) => setNotes(data || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [activeWorkspace?.id]);

  const handleCreateNote = async () => {
    try {
      const note = await api.createNote({
        title: 'Untitled',
        icon: '📝',
        workspaceId: activeWorkspace?.id || null,
      });
      router.push(`/app/notes/${note.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const favoriteNotes = notes.filter((n) => n.isFavorite);
  const recentNotes = notes.slice(0, 6);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#131316] select-none">
      <Topbar note={null} />

      <div className="max-w-4xl w-full mx-auto px-6 py-8 sm:px-12 sm:py-10 space-y-10 animate-pop-in">
        {/* Welcome Banner */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
            Good day, {user?.name?.split(' ')[0] || 'Partner'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {activeWorkspace?.name || 'Workspace'} • Connected to MySQL Cluster Engine
          </p>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Primary Create Button */}
          <button
            onClick={handleCreateNote}
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white text-left shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-sm">Create New Document</div>
              <div className="text-xs text-indigo-100/80 mt-1">
                Start with a blank canvas or slash commands
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white/90 pt-4 group-hover:translate-x-1 transition-transform">
              <span>Create page</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* Database Info Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-500 mb-3">
                <Database className="w-5 h-5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Database Engine</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                MySQL 8.0 Clustered
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                ACID compliant, cascading subtrees & auto-indexing
              </div>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Healthy & Synced</span>
            </div>
          </div>

          {/* Security Info Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-500 mb-3">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Access Control</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                JWT HMAC Authentication
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Signed bearer tokens with encrypted bcrypt password hashing
              </div>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5 pt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Role: {user?.role || 'Member'}</span>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {favoriteNotes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Pinned Favorites ({favoriteNotes.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {favoriteNotes.map((note) => (
                <button
                  key={'fav_card_' + note.id}
                  onClick={() => router.push(`/app/notes/${note.id}`)}
                  className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-indigo-500/40 hover:bg-gray-50/60 dark:hover:bg-white/[0.04] transition-all text-left group"
                >
                  <div className="text-2xl mb-2.5">{note.icon || '📝'}</div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {note.title || 'Untitled'}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Notes Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Workspace Pages</span>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-xs text-gray-400">
              Loading notes...
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.01] text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Your workspace is empty
              </div>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Create your first Notion note with full block formatting, custom headers, and subpages.
              </p>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Create First Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentNotes.map((note) => (
                <button
                  key={'recent_' + note.id}
                  onClick={() => router.push(`/app/notes/${note.id}`)}
                  className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-indigo-500/40 hover:bg-gray-50/60 dark:hover:bg-white/[0.04] transition-all text-left group"
                >
                  <div className="text-2xl mb-2.5">{note.icon || '📝'}</div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {note.title || 'Untitled'}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
