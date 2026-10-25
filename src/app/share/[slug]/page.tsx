'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Globe, ArrowLeft, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import NotionEditor from '@/components/NotionEditor';
import { api } from '@/lib/api';

export default function PublicSharePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api
      .getPublicNote(slug)
      .then((data) => setNote(data))
      .catch((err) => {
        setError(err?.message || 'This note is not publicly shared or does not exist.');
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#131316]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">Loading public document...</span>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111114] p-4 select-none">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/[0.08] shadow-2xl animate-pop-in">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.05] text-gray-400 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Note Unavailable</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {error || 'This link may have expired or the author has unpublished it.'}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#131316] text-gray-900 dark:text-gray-100">
      {/* Top Acrylic Banner */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-12 bg-white/80 dark:bg-[#131316]/80 backdrop-blur-xl border-b border-gray-200/70 dark:border-white/[0.06] select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            N
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Public Document
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live View
          </span>
        </div>

        <Link
          href="/"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1.5"
        >
          <span>Create your own workspace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Cover image banner */}
      {note.coverImage && (
        <div className="w-full h-52 sm:h-64 overflow-hidden bg-gray-100 dark:bg-white/[0.02]">
          <img
            src={note.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content canvas */}
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-6">
        {note.icon && (
          <div className="text-5xl select-none mb-3">{note.icon}</div>
        )}

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-950 dark:text-white">
          {note.title || 'Untitled'}
        </h1>

        {/* Metadata info */}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 pb-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-semibold">
              {note.user?.name?.charAt(0) || 'U'}
            </div>
            <span>Published by {note.user?.name || 'Author'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Render read-only blocks */}
        <div className="pt-2">
          <NotionEditor
            initialContent={note.content}
            onChange={() => {}}
            readOnly={true}
          />
        </div>
      </main>
    </div>
  );
}
