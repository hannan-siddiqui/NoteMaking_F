'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Trash2,
  Star,
  MoreHorizontal,
  FolderPlus,
  FileText,
  LogOut,
  Building,
  Check,
  PanelLeftClose,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface NoteItem {
  id: string;
  title: string;
  icon?: string | null;
  parentId?: string | null;
  isFavorite?: boolean;
  children?: NoteItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onNewNote: (parentId?: string | null) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onOpenSearch,
  onNewNote,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, activeWorkspace, logout } = useAuth();

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeMenuNoteId, setActiveMenuNoteId] = useState<string | null>(null);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  // Fetch full tree
  const refreshTree = async () => {
    try {
      const data = await api.getNoteTree(activeWorkspace?.id);
      setNotes(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshTree();
  }, [activeWorkspace?.id, pathname]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.duplicateNote(id);
      await refreshTree();
      router.push(`/app/notes/${res.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setActiveMenuNoteId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.archiveNote(id);
      await refreshTree();
      if (pathname.includes(id)) {
        router.push('/app');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActiveMenuNoteId(null);
    }
  };

  const handleToggleFavorite = async (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.updateNote(note.id, { isFavorite: !note.isFavorite });
      await refreshTree();
    } catch (err) {
      console.error(err);
    } finally {
      setActiveMenuNoteId(null);
    }
  };

  // Group notes into tree
  const rootNotes = notes.filter((n) => !n.parentId);
  const favoriteNotes = notes.filter((n) => n.isFavorite);

  const renderNoteNode = (note: NoteItem, depth: number = 0) => {
    const children = notes.filter((n) => n.parentId === note.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(note.id);
    const isActive = pathname === `/app/notes/${note.id}`;

    return (
      <div key={note.id} className="select-none">
        <div
          onClick={() => router.push(`/app/notes/${note.id}`)}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          className={`group relative flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs font-normal transition-colors ${
            isActive
              ? 'bg-gray-200/70 dark:bg-[#282828] text-gray-900 dark:text-white font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#242424] hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Expand / Collapse Chevron */}
            <button
              onClick={(e) => toggleExpand(note.id, e)}
              className={`p-0.5 rounded hover:bg-gray-300/60 dark:hover:bg-[#333] transition-colors ${
                hasChildren ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Note Icon */}
            <span className="text-sm shrink-0">{note.icon || '📝'}</span>

            {/* Title */}
            <span className="truncate">{note.title || 'Untitled'}</span>
          </div>

          {/* Hover Action buttons */}
          <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
            {/* Quick add subpage */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNewNote(note.id);
                setExpandedIds((prev) => new Set(prev).add(note.id));
              }}
              title="Add sub-page"
              className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]"
            >
              <Plus className="w-3 h-3" />
            </button>

            {/* Note Options Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuNoteId(activeMenuNoteId === note.id ? null : note.id);
                }}
                className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]"
              >
                <MoreHorizontal className="w-3 h-3" />
              </button>

              {activeMenuNoteId === note.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#333] shadow-xl py-1 z-50 text-xs animate-pop-in"
                >
                  <button
                    onClick={(e) => handleToggleFavorite(note, e)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-[#2e2e2e]"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>{note.isFavorite ? 'Unfavorite' : 'Add to Favorites'}</span>
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(note.id, e)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-[#2e2e2e]"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render child pages if expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {children.map((child) => renderNoteNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-[#f9f9f8] dark:bg-[#121214] border-r border-gray-200/70 dark:border-white/[0.06] flex flex-col transition-all duration-300 ease-in-out md:static select-none overflow-hidden ${
        isOpen
          ? 'w-64 translate-x-0 opacity-100 shadow-2xl md:shadow-none'
          : 'w-0 -translate-x-full md:translate-x-0 md:w-0 border-r-0 opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-64 flex flex-col h-full shrink-0">
        {/* Workspace Switcher Header */}
        <div className="p-2.5 border-b border-gray-200/60 dark:border-white/[0.06] flex items-center justify-between">
        <button
          onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-200/60 dark:hover:bg-white/[0.05] text-left transition-all flex-1 min-w-0"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs font-semibold shadow-xs shrink-0">
            {activeWorkspace?.name?.charAt(0) || 'N'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate tracking-tight">
              {activeWorkspace?.name || 'Workspace'}
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
              {user?.email || 'user@workspace.local'}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </button>

        {/* Collapse sidebar button */}
        <button
          type="button"
          onClick={onClose}
          title="Collapse sidebar"
          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-white/[0.05] rounded-lg transition-all cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Quick Actions */}
      <div className="p-2 space-y-0.5">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-normal">Search</span>
          </div>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/[0.08] bg-gray-100 dark:bg-white/[0.04] text-gray-400 font-mono">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={() => onNewNote(null)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-500/10 rounded-lg transition-all"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            <span>New Page</span>
          </div>
        </button>
      </div>

      {/* Main Pages Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
        {/* Favorites section */}
        {favoriteNotes.length > 0 && (
          <div>
            <div className="px-2.5 pb-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Favorites
            </div>
            <div className="space-y-0.5">
              {favoriteNotes.map((note) => (
                <div
                  key={'fav_' + note.id}
                  onClick={() => router.push(`/app/notes/${note.id}`)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer truncate transition-all ${
                    pathname === `/app/notes/${note.id}`
                      ? 'bg-gray-200/80 dark:bg-white/[0.08] text-gray-950 dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="text-sm shrink-0">{note.icon || '📝'}</span>
                  <span className="truncate">{note.title || 'Untitled'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Private/Shared Notes Tree */}
        <div>
          <div className="flex items-center justify-between px-2.5 pb-1">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Workspace Pages
            </span>
            <button
              onClick={() => onNewNote(null)}
              className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-white/[0.05] transition-colors"
              title="Add root page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {rootNotes.length === 0 ? (
              <div className="px-2.5 py-3 text-xs text-gray-400 dark:text-gray-500 italic">
                No pages yet. Click &quot;New Page&quot; to begin!
              </div>
            ) : (
              rootNotes.map((note) => renderNoteNode(note, 0))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2 border-t border-gray-200/60 dark:border-white/[0.06] space-y-1">
        <button
          onClick={() => router.push('/app/trash')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all ${
            pathname === '/app/trash'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400" />
          <span>Trash & Archive</span>
        </button>

        {/* User profile & logout */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gray-200/40 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/[0.04]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'Workspace User'}
              </div>
              <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">
                {user?.role || 'Member'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1 rounded text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      </div>
    </aside>
  );
}
