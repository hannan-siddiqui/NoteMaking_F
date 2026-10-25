'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Star,
  Share2,
  MoreHorizontal,
  Cloud,
  Check,
  Copy,
  Trash2,
  FileDown,
  Globe,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useTheme } from '@/lib/theme-context';
import { useSidebar } from '@/lib/sidebar-context';

interface TopbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  note?: {
    id: string;
    title: string;
    icon?: string | null;
    isFavorite?: boolean;
    isPublished?: boolean;
    shareSlug?: string | null;
    content?: string;
    breadcrumbs?: Array<{ id: string; title: string; icon: string | null }>;
  } | null;
  saveStatus?: 'saved' | 'saving' | 'error';
  onUpdateNote?: (data: any) => void;
  onDeleteNote?: () => void;
}

export default function Topbar({
  onToggleSidebar,
  isSidebarOpen,
  note,
  saveStatus = 'saved',
  onUpdateNote,
  onDeleteNote,
}: TopbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar, isSidebarOpen: sidebarContextOpen } = useSidebar();
  const effectiveSidebarOpen = isSidebarOpen !== undefined ? isSidebarOpen : sidebarContextOpen;
  const handleToggle = onToggleSidebar || toggleSidebar;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleFavorite = async () => {
    if (!note || !onUpdateNote) return;
    try {
      const newFav = !note.isFavorite;
      await api.updateNote(note.id, { isFavorite: newFav });
      onUpdateNote({ isFavorite: newFav });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async () => {
    if (!note || !onUpdateNote) return;
    setIsPublishing(true);
    try {
      const res = await api.togglePublish(note.id);
      onUpdateNote({
        isPublished: res.isPublished,
        shareSlug: res.shareSlug,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const shareUrl =
    typeof window !== 'undefined' && note?.shareSlug
      ? `${window.location.origin}/share/${note.shareSlug}`
      : '';

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    if (!note) return;
    let md = `# ${note.title}\n\n`;
    try {
      const blocks = JSON.parse(note.content || '[]');
      blocks.forEach((b: any) => {
        if (b.type === 'h1') md += `# ${b.text}\n\n`;
        else if (b.type === 'h2') md += `## ${b.text}\n\n`;
        else if (b.type === 'h3') md += `### ${b.text}\n\n`;
        else if (b.type === 'todo') md += `- [${b.checked ? 'x' : ' '}] ${b.text}\n`;
        else if (b.type === 'bullet') md += `* ${b.text}\n`;
        else if (b.type === 'quote') md += `> ${b.text}\n\n`;
        else if (b.type === 'code') md += `\`\`\`\n${b.text}\n\`\`\`\n\n`;
        else md += `${b.text}\n\n`;
      });
    } catch {
      md += note.content || '';
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'note'}.md`;
    a.click();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 border-b border-gray-200/70 dark:border-white/[0.06] bg-white/80 dark:bg-[#131315]/80 backdrop-blur-xl select-none">
      {/* Left: Sidebar toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 overflow-hidden">
        {!effectiveSidebarOpen && (
          <button
            type="button"
            onClick={handleToggle}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Expand sidebar"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Breadcrumb path */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
          {note?.breadcrumbs?.map((crumb) => (
            <React.Fragment key={crumb.id}>
              <button
                onClick={() => router.push(`/app/notes/${crumb.id}`)}
                className="hover:text-gray-900 dark:hover:text-white truncate max-w-[140px] transition-colors font-normal"
              >
                {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                {crumb.title}
              </button>
              <span className="text-gray-300 dark:text-white/20">/</span>
            </React.Fragment>
          ))}
          {note && (
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] flex items-center gap-1.5">
              {note.icon && <span className="text-sm">{note.icon}</span>}
              <span className="truncate">{note.title || 'Untitled'}</span>
            </span>
          )}
        </nav>
      </div>

      {/* Right: Sync Status & Actions */}
      <div className="flex items-center gap-2">
        {/* Modern Save Status Badge */}
        <div className="hidden sm:flex items-center">
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Saved</span>
            </div>
          )}
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Sync Error</span>
            </div>
          )}
        </div>

        {note && (
          <>
            {/* Share button */}
            <button
              onClick={() => setIsShareModalOpen(!isShareModalOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                note.isPublished
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                  : 'hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-700 dark:text-gray-300'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{note.isPublished ? 'Public' : 'Share'}</span>
            </button>

            {/* Favorite Star */}
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-xl transition-all ${
                note.isFavorite
                  ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08]'
              }`}
              title="Pin to Favorites"
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white dark:bg-[#1c1c1f] border border-gray-200 dark:border-white/[0.08] shadow-2xl p-1 z-40 animate-pop-in">
                  <button
                    onClick={() => {
                      exportMarkdown();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-gray-400" />
                    <span>Export Markdown</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteNote?.();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Move to Trash</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="h-5 w-[1px] bg-gray-200 dark:bg-white/[0.08] mx-0.5" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>
      </div>

      {/* Share Modal Dialog */}
      {isShareModalOpen && note && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#202020] border border-gray-200 dark:border-[#2e2e2e] shadow-2xl p-5 animate-pop-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2c2c2c]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Publish to Web
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Share to Web
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Publish an open read-only web link anyone can view
                  </div>
                </div>
                <button
                  disabled={isPublishing}
                  onClick={handleTogglePublish}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    note.isPublished ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      note.isPublished ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {note.isPublished && (
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#181818] text-gray-700 dark:text-gray-300 select-all focus:outline-none"
                    />
                    <button
                      onClick={copyShareLink}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-500 hover:underline"
                  >
                    <span>Open published page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-[#2c2c2c]">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
