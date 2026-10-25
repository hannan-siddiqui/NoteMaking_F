'use client';

import React, { useState } from 'react';
import { X, Smile, Search } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (icon: string | null) => void;
  currentIcon?: string | null;
}

const EMOJI_GROUPS = [
  {
    category: 'Work & Enterprise',
    emojis: ['📝', '📋', '📁', '💼', '🏢', '📊', '📈', '🚀', '🎯', '💡', '📌', '📎', '🔒', '🔑', '🏷️', '📅'],
  },
  {
    category: 'Technology & Code',
    emojis: ['💻', '🖥️', '⌨️', '🗄️', '⚡', '🌐', '⚙️', '🛠️', '🔬', '📡', '📱', '🤖', '📦', '💾', '🔌', '🛰️'],
  },
  {
    category: 'Ideas & Status',
    emojis: ['✨', '🔥', '⭐', '🌟', '🎨', '🧠', '☕', '🎉', '✅', '❌', '⚠️', '🚨', '🟢', '🟡', '🔴', '💬'],
  },
  {
    category: 'Objects & Life',
    emojis: ['📚', '📖', '🔍', '🧭', '🏠', '🌍', '🌱', '☀️', '🌙', '🌊', '🌲', '🏆', '💎', '🎨', '✈️', '🛡️'],
  },
];

export default function IconPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentIcon,
}: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200/70 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">
              Select Page Icon
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-100 dark:border-[#282828]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search emoji..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#191919] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Emoji Grid */}
        <div className="p-3 max-h-[300px] overflow-y-auto space-y-3">
          {EMOJI_GROUPS.map((group, idx) => (
            <div key={idx}>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
                {group.category}
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {group.emojis.map((emoji, eIdx) => (
                  <button
                    key={eIdx}
                    onClick={() => {
                      onSelect(emoji);
                      onClose();
                    }}
                    className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-all hover:scale-110 ${
                      currentIcon === emoji ? 'bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-500' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 dark:border-[#2e2e2e] bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          {currentIcon ? (
            <button
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Remove Icon
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
