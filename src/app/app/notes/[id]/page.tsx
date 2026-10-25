'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Image as ImageIcon,
  Smile,
  Plus,
  Trash2,
  FileText,
  CornerDownRight,
  AlertCircle,
} from 'lucide-react';
import Topbar from '@/components/Topbar';
import NotionEditor from '@/components/NotionEditor';
import CoverImageModal from '@/components/CoverImageModal';
import IconPickerModal from '@/components/IconPickerModal';
import { api } from '@/lib/api';

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.id as string;

  const [note, setNote] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch note
  const loadNote = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getNoteById(noteId);
      setNote(data);
      setTitle(data.title || 'Untitled');
    } catch (err: any) {
      console.error(err);
      if (err?.statusCode === 404) {
        router.push('/app');
      }
    } finally {
      setIsLoading(false);
    }
  }, [noteId, router]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  // Debounced auto-save function
  const triggerAutoSave = (patchData: any) => {
    setSaveStatus('saving');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const updated = await api.updateNote(noteId, patchData);
        setNote((prev: any) => ({ ...prev, ...updated }));
        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error', err);
        setSaveStatus('error');
      }
    }, 600);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    triggerAutoSave({ title: newTitle || 'Untitled' });
  };

  const handleContentChange = (contentJson: string) => {
    triggerAutoSave({ content: contentJson });
  };

  const handleCoverSelect = (coverUrl: string | null) => {
    setNote((prev: any) => ({ ...prev, coverImage: coverUrl }));
    triggerAutoSave({ coverImage: coverUrl });
  };

  const handleIconSelect = (icon: string | null) => {
    setNote((prev: any) => ({ ...prev, icon }));
    triggerAutoSave({ icon });
  };

  const handleDelete = async () => {
    try {
      await api.archiveNote(noteId);
      router.push('/app');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubPage = async () => {
    try {
      const child = await api.createNote({
        title: 'Untitled Subpage',
        icon: '📄',
        parentId: noteId,
        workspaceId: note?.workspaceId,
      });
      router.push(`/app/notes/${child.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <Topbar note={null} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading document...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Topbar */}
      <Topbar
        note={note}
        saveStatus={saveStatus}
        onUpdateNote={(patch) => setNote((prev: any) => ({ ...prev, ...patch }))}
        onDeleteNote={handleDelete}
      />

      {/* Note Document Canvas */}
      <div className="w-full pb-32">
        {/* Cover Image Banner */}
        {note.coverImage ? (
          <div className="group relative w-full h-52 sm:h-64 overflow-hidden bg-gray-100 dark:bg-[#202020]">
            <img
              src={note.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <button
                onClick={() => setIsCoverModalOpen(true)}
                className="px-2.5 py-1 text-xs font-medium bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-sm transition-colors"
              >
                Change Cover
              </button>
              <button
                onClick={() => handleCoverSelect(null)}
                className="px-2.5 py-1 text-xs font-medium bg-black/60 hover:bg-black/80 text-red-300 rounded-md backdrop-blur-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}

        {/* Header container */}
        <div className="max-w-4xl mx-auto px-6 sm:px-12 pt-8">
          {/* Action buttons (Add Cover / Add Icon) */}
          <div className="flex items-center gap-1.5 mb-4 text-xs text-gray-400">
            {!note.icon && (
              <button
                onClick={() => setIsIconModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-700 dark:hover:text-gray-200 transition-all"
              >
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Add icon</span>
              </button>
            )}
            {!note.coverImage && (
              <button
                onClick={() => setIsCoverModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-700 dark:hover:text-gray-200 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Add cover</span>
              </button>
            )}
          </div>

          {/* Floating Emoji Icon */}
          {note.icon && (
            <div className="relative group inline-block mb-3">
              <button
                onClick={() => setIsIconModalOpen(true)}
                className="text-5xl hover:scale-105 transition-transform select-none cursor-pointer p-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                title="Change icon"
              >
                {note.icon}
              </button>
            </div>
          )}

          {/* Document Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="w-full text-3xl sm:text-4xl font-bold tracking-tight bg-transparent text-gray-950 dark:text-neutral-100 placeholder-gray-300 dark:placeholder-neutral-700 focus:outline-none mb-6"
          />
        </div>

        {/* Notion Block-Based Editor */}
        <NotionEditor
          initialContent={note.content}
          onChange={handleContentChange}
        />

        {/* Nested Sub-Pages Section */}
        <div className="max-w-4xl mx-auto px-6 sm:px-12 pt-8 border-t border-gray-200/60 dark:border-white/[0.06] mt-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Sub-pages ({note.children?.length || 0})
            </span>
            <button
              onClick={handleAddSubPage}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sub-page</span>
            </button>
          </div>

          {note.children && note.children.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {note.children.map((child: any) => (
                <button
                  key={child.id}
                  onClick={() => router.push(`/app/notes/${child.id}`)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200/70 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:border-indigo-500/30 text-left transition-all group"
                >
                  <span className="text-lg">{child.icon || '📄'}</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {child.title || 'Untitled'}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400 dark:text-gray-500 italic">
              No nested sub-pages yet. Click &quot;Add Sub-page&quot; to nest docs under this page.
            </div>
          )}
        </div>
      </div>

      {/* Cover Image Picker Modal */}
      <CoverImageModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onSelect={handleCoverSelect}
        currentCover={note.coverImage}
      />

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelect={handleIconSelect}
        currentIcon={note.icon}
      />
    </div>
  );
}
