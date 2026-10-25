'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Shield,
  Database,
  ArrowRight,
  FolderTree,
  Check,
  CheckCircle2,
  Code2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const router = useRouter();
  const { token, isLoading, loginAsDemo } = useAuth();

  useEffect(() => {
    if (!isLoading && token) {
      router.push('/app');
    }
  }, [isLoading, token, router]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0c0e] text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-indigo-500/20">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/25">
              N
            </div>
            <span className="font-semibold text-base tracking-tight text-gray-950 dark:text-white">
              Notion Enterprise
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/[0.08] border border-indigo-500/20 text-xs font-medium text-indigo-600 dark:text-indigo-400 shadow-xs animate-pop-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Connected Workspace • Real-Time Autosave • MySQL Clustered</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.1] max-w-4xl mx-auto">
          The connected workspace for{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            modern teams.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
          Craft rich hierarchical documents with slash commands, interactive checklists, custom cover art, real-time autosave, and secure JWT authentication.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            onClick={loginAsDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Launch Instant Demo Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-800 dark:text-gray-200 transition-all shadow-xs"
          >
            Sign In with Email
          </Link>
        </div>

        {/* Live UI Mockup Showcase */}
        <div className="pt-12 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200/80 dark:border-white/[0.1] bg-white dark:bg-[#131316] shadow-2xl overflow-hidden text-left">
            {/* Mockup Header */}
            <div className="h-10 px-4 border-b border-gray-200/70 dark:border-white/[0.06] bg-gray-50/70 dark:bg-white/[0.02] flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-gray-400 ml-2 font-mono text-[11px]">workspace / Product Roadmap</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Saved
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 font-medium">
                  Public Link
                </span>
              </div>
            </div>

            {/* Mockup Content Body */}
            <div className="p-8 space-y-5">
              <div className="text-4xl select-none">🚀</div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Product Roadmap & Engineering Goals
              </h2>
              <div className="p-3.5 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
                <span className="text-base select-none">💡</span>
                <p className="leading-relaxed">
                  Type <kbd className="px-1.5 py-0.5 rounded bg-indigo-500/20 font-mono text-[10px]">/</kbd> anywhere in the editor to insert headings, interactive task checklists, code blocks, or quote highlights.
                </p>
              </div>

              {/* Sample To-Dos */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-neutral-200">
                  <div className="w-4 h-4 rounded-[4px] bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="line-through text-gray-400 dark:text-neutral-500">
                    Set up relational database schemas & Prisma ORM migrations
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-neutral-200">
                  <div className="w-4 h-4 rounded-[4px] bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="line-through text-gray-400 dark:text-neutral-500">
                    Implement real-time debounced autosave with visual status indicators
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-neutral-200">
                  <div className="w-4 h-4 rounded-[4px] border border-gray-300 dark:border-white/20 shrink-0" />
                  <span>Launch public shareable read-only URLs for instant collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-16 text-left">
          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-indigo-500/30 transition-all shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <FolderTree className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Nested Tree Hierarchy</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Create sub-pages infinitely deep with breadcrumbs and fast sidebar tree navigation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-purple-500/30 transition-all shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Block-Based Editor</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Use slash commands to write headings, task lists, code snippets, and quotes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-blue-500/30 transition-all shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">MySQL Clustered DB</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              ACID relational schema with cascading subtrees, auto-indexing, and backup safety.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/[0.06] hover:border-emerald-500/30 transition-all shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">JWT Enterprise Auth</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Bcrypt hashed passwords, HMAC signed bearer tokens, and workspace permissions.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-gray-200/70 dark:border-white/[0.06] py-10 text-center text-xs text-gray-400 dark:text-gray-500">
        <p>Notion Enterprise Workspace • Connected Knowledge Management System</p>
      </footer>
    </div>
  );
}
