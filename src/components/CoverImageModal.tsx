'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface CoverImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string | null) => void;
  currentCover?: string | null;
}

const PRESET_COVERS = [
  {
    name: 'Northern Gradient',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimalist Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cyberpunk Tech',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Database & Server Grid',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Sunset Horizon',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Dark Nebula',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Abstract Fluid',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Modern Workspace',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function CoverImageModal({
  isOpen,
  onClose,
  onSelect,
  currentCover,
}: CoverImageModalProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'link'>('gallery');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/70 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
              Change Page Cover
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-[#2e2e2e] px-5 pt-2 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'gallery'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Curated Gallery
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'link'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Link URL
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[380px] overflow-y-auto">
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_COVERS.map((cover, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(cover.url);
                    onClose();
                  }}
                  className="group relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-[#333] hover:ring-2 hover:ring-indigo-500 focus:outline-none transition-all"
                >
                  <img
                    src={cover.url}
                    alt={cover.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium drop-shadow truncate">
                      {cover.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Direct Image URL (Unsplash, Imgur, or CDN)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#333] bg-gray-50 dark:bg-[#191919] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    disabled={!customUrl.trim()}
                    onClick={() => {
                      if (customUrl.trim()) {
                        onSelect(customUrl.trim());
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-[#2e2e2e] bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          {currentCover ? (
            <button
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Remove Cover
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
