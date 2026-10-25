'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const { register, loginAsDemo, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ name, email, password });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Try again.');
    }
  };

  const handleDemo = async () => {
    setError(null);
    try {
      await loginAsDemo();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in as demo user.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa] dark:bg-[#0e0e11] overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md rounded-2xl bg-white/90 dark:bg-[#16161a]/90 backdrop-blur-2xl border border-gray-200/80 dark:border-white/[0.08] shadow-2xl p-7 sm:p-8 space-y-6 animate-pop-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-indigo-500/25">
            N
          </div>
          <h1 className="text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
            Create an account
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Start organizing your documents and ideas in one workspace
          </p>
        </div>

        {/* Demo Fast Access Link */}
        <div className="p-3.5 rounded-xl bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08] border border-indigo-500/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Want to test immediately?</span>
          </div>
          <button
            type="button"
            onClick={handleDemo}
            disabled={isLoading}
            className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <span>One-Click Enterprise Demo Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Separator */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-white/[0.08] w-full" />
          <span className="bg-white dark:bg-[#16161a] px-3 text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium absolute">
            or sign up with email
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2 animate-pop-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Connor"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-white/[0.1] bg-gray-50/70 dark:bg-white/[0.03] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@acme.corp"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-white/[0.1] bg-gray-50/70 dark:bg-white/[0.03] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <span className="text-[10px] text-gray-400">Min 6 characters</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-gray-300 dark:border-white/[0.1] bg-gray-50/70 dark:bg-white/[0.03] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
              {/* Show / Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {isLoading ? 'Creating Workspace...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
