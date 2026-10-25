'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  AlertCircle,
  Type,
  GripVertical,
  Trash2,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Plus,
} from 'lucide-react';

export type BlockType =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'todo'
  | 'bullet'
  | 'number'
  | 'callout'
  | 'quote'
  | 'code'
  | 'divider';

export interface Block {
  id: string;
  type: BlockType;
  text: string;
  checked?: boolean;
}

interface NotionEditorProps {
  initialContent?: string;
  onChange: (blocksJson: string) => void;
  readOnly?: boolean;
}

const SLASH_COMMANDS: Array<{
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    type: 'p',
    label: 'Text',
    description: 'Plain text paragraph',
    icon: <Type className="w-4 h-4 text-gray-500" />,
  },
  {
    type: 'h1',
    label: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 className="w-4 h-4 text-blue-500" />,
  },
  {
    type: 'h2',
    label: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 className="w-4 h-4 text-blue-400" />,
  },
  {
    type: 'h3',
    label: 'Heading 3',
    description: 'Small sub-heading',
    icon: <Heading3 className="w-4 h-4 text-blue-300" />,
  },
  {
    type: 'todo',
    label: 'To-do List',
    description: 'Track tasks with interactive checkbox',
    icon: <CheckSquare className="w-4 h-4 text-emerald-500" />,
  },
  {
    type: 'bullet',
    label: 'Bulleted List',
    description: 'Simple bulleted list',
    icon: <List className="w-4 h-4 text-amber-500" />,
  },
  {
    type: 'number',
    label: 'Numbered List',
    description: 'Ordered sequential list',
    icon: <ListOrdered className="w-4 h-4 text-amber-500" />,
  },
  {
    type: 'callout',
    label: 'Callout',
    description: 'Stand out callout with highlight',
    icon: <AlertCircle className="w-4 h-4 text-indigo-500" />,
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Capture a quote or takeaway',
    icon: <Quote className="w-4 h-4 text-purple-500" />,
  },
  {
    type: 'code',
    label: 'Code',
    description: 'Monospaced code snippet',
    icon: <Code className="w-4 h-4 text-rose-500" />,
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Visually divide blocks with a line',
    icon: <Minus className="w-4 h-4 text-gray-400" />,
  },
];

export default function NotionEditor({
  initialContent,
  onChange,
  readOnly = false,
}: NotionEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [slashMenu, setSlashMenu] = useState<{
    isOpen: boolean;
    blockIndex: number;
    query: string;
    selectedIndex: number;
  }>({
    isOpen: false,
    blockIndex: -1,
    query: '',
    selectedIndex: 0,
  });

  const blockRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // Parse initial content
  useEffect(() => {
    try {
      if (initialContent) {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlocks(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setBlocks([{ id: 'b_' + Date.now(), type: 'p', text: '' }]);
  }, [initialContent]);

  // Propagate changes
  const updateBlocks = useCallback(
    (newBlocks: Block[]) => {
      setBlocks(newBlocks);
      onChange(JSON.stringify(newBlocks));
    },
    [onChange]
  );

  const handleTextChange = (id: string, text: string) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;

    // Check for slash menu trigger
    if (text === '/') {
      setSlashMenu({
        isOpen: true,
        blockIndex: index,
        query: '',
        selectedIndex: 0,
      });
    } else if (text.startsWith('/')) {
      setSlashMenu((prev) => ({
        ...prev,
        isOpen: true,
        blockIndex: index,
        query: text.slice(1).toLowerCase(),
      }));
    } else if (slashMenu.isOpen && slashMenu.blockIndex === index) {
      setSlashMenu((prev) => ({ ...prev, isOpen: false }));
    }

    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], text };
    updateBlocks(newBlocks);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    index: number,
    block: Block
  ) => {
    // Slash menu navigation
    if (slashMenu.isOpen && slashMenu.blockIndex === index) {
      const filtered = SLASH_COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().includes(slashMenu.query)
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashMenu((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex + 1) % (filtered.length || 1),
        }));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashMenu((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex - 1 + filtered.length) % (filtered.length || 1),
        }));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const chosen = filtered[slashMenu.selectedIndex] || filtered[0];
        if (chosen) {
          applyBlockType(index, chosen.type);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setSlashMenu((prev) => ({ ...prev, isOpen: false }));
        return;
      }
    }

    // Press Enter to create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'code') {
        // Allow multiline code
        return;
      }
      e.preventDefault();
      const newBlock: Block = {
        id: 'b_' + Date.now() + Math.random().toString(36).slice(2, 6),
        type: block.type === 'todo' || block.type === 'bullet' || block.type === 'number' ? block.type : 'p',
        text: '',
        checked: false,
      };
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      updateBlocks(newBlocks);

      setTimeout(() => {
        blockRefs.current[newBlock.id]?.focus();
      }, 20);
    }

    // Press Backspace on empty block
    if (e.key === 'Backspace' && block.text === '') {
      if (block.type !== 'p') {
        e.preventDefault();
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], type: 'p' };
        updateBlocks(newBlocks);
      } else if (blocks.length > 1) {
        e.preventDefault();
        const prevBlock = blocks[index - 1];
        const newBlocks = blocks.filter((_, i) => i !== index);
        updateBlocks(newBlocks);
        if (prevBlock) {
          setTimeout(() => {
            blockRefs.current[prevBlock.id]?.focus();
          }, 20);
        }
      }
    }
  };

  const applyBlockType = (index: number, type: BlockType) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      type,
      text: newBlocks[index].text.replace(/^\/[a-zA-Z0-9]*/, ''),
    };
    updateBlocks(newBlocks);
    setSlashMenu((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      const el = blockRefs.current[newBlocks[index].id];
      if (el) {
        adjustTextareaHeight(el, type);
        el.focus();
      }
    }, 20);
  };

  const toggleTodo = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      checked: !newBlocks[index].checked,
    };
    updateBlocks(newBlocks);
  };

  const deleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      updateBlocks([{ id: 'b_' + Date.now(), type: 'p', text: '' }]);
      return;
    }
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  };

  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dragOverBlockIndex, setDragOverBlockIndex] = useState<number | null>(null);

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length || fromIndex === toIndex) return;
    const newBlocks = [...blocks];
    const [target] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, target);
    updateBlocks(newBlocks);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBlockIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverBlockIndex !== index) {
      setDragOverBlockIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDragOverBlockIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverBlockIndex(null);

    const rawData = e.dataTransfer.getData('text/plain');
    const sourceIndex = rawData !== '' ? parseInt(rawData, 10) : draggedBlockIndex;

    setDraggedBlockIndex(null);
    if (sourceIndex === null || isNaN(sourceIndex) || sourceIndex === targetIndex) return;
    moveBlock(sourceIndex, targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedBlockIndex(null);
    setDragOverBlockIndex(null);
  };

  const duplicateBlock = (index: number) => {
    const target = blocks[index];
    const clone: Block = {
      ...target,
      id: 'b_' + Date.now(),
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, clone);
    updateBlocks(newBlocks);
  };

  // Auto-resize textarea helper with type-specific minimums
  const adjustTextareaHeight = (el: HTMLTextAreaElement | null, type?: BlockType) => {
    if (!el) return;
    el.style.height = 'auto';
    const minH = type === 'h1' ? 48 : type === 'h2' ? 38 : type === 'h3' ? 32 : 28;
    el.style.height = `${Math.max(el.scrollHeight, minH)}px`;
  };

  // Keep heights in sync whenever blocks change or page mounts
  useEffect(() => {
    blocks.forEach((b) => {
      const el = blockRefs.current[b.id];
      if (el) {
        adjustTextareaHeight(el, b.type);
      }
    });
  }, [blocks]);

  const filteredCommands = SLASH_COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(slashMenu.query)
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto py-4 px-2 sm:px-8 space-y-1 min-h-[500px]">
      {blocks.map((block, index) => {
        const isDragged = draggedBlockIndex === index;
        const isDragOver = dragOverBlockIndex === index;
        const isDraggingAny = draggedBlockIndex !== null;

        return (
          <div
            key={block.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`group relative flex items-start -ml-2 sm:-ml-16 pl-2 pr-2 py-0.5 rounded-xl transition-all duration-150 ${
              isDragOver ? 'border-t-2 border-indigo-500 bg-indigo-500/[0.04]' : ''
            } ${isDragged ? 'opacity-30' : 'hover:bg-gray-100/60 dark:hover:bg-white/[0.03]'}`}
          >
            {/* Non-overlapping Left Gutter Toolbar */}
            {!readOnly ? (
              <div className="w-14 sm:w-16 shrink-0 flex items-center justify-end gap-0.5 pt-1.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity select-none z-10">
                <div className="flex items-center gap-0.5 bg-white/95 dark:bg-[#18181b]/95 border border-gray-200/90 dark:border-white/10 rounded-lg p-0.5 shadow-xs backdrop-blur-xs">
                  {/* Drag to reorder handle */}
                  <div
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    className="group/btn relative p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity shadow-md z-30">
                      Drag to move
                    </span>
                  </div>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveBlock(index, index - 1)}
                    className="group/btn relative p-0.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-3 h-3" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity shadow-md z-30">
                      Move up
                    </span>
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === blocks.length - 1}
                    onClick={() => moveBlock(index, index + 1)}
                    className="group/btn relative p-0.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-3 h-3" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity shadow-md z-30">
                      Move down
                    </span>
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => duplicateBlock(index)}
                    className="group/btn relative p-0.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity shadow-md z-30">
                      Duplicate
                    </span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteBlock(index)}
                    className="group/btn relative p-0.5 rounded hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity shadow-md z-30">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Render block content */}
            <div
              className={`flex-1 min-w-0 flex items-start gap-2.5 ${
                isDraggingAny ? 'pointer-events-none select-none' : ''
              }`}
            >
              {/* Custom Animated Checkbox for Todo */}
              {block.type === 'todo' && (
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => toggleTodo(index)}
                  className={`mt-1 w-4 h-4 rounded-[4px] flex items-center justify-center transition-all duration-150 shrink-0 select-none ${
                    block.checked
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-gray-300 dark:border-white/20 hover:border-indigo-500/70 dark:hover:border-indigo-400/70 bg-transparent'
                  }`}
                >
                  {block.checked && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              )}

              {/* Bullet for list */}
              {block.type === 'bullet' && (
                <span className="mt-1 text-gray-400 dark:text-gray-500 text-lg leading-none select-none">
                  •
                </span>
              )}

              {/* Number for ordered list */}
              {block.type === 'number' && (
                <span className="mt-1 text-xs font-semibold text-gray-400 dark:text-gray-500 select-none min-w-[16px]">
                  {index + 1}.
                </span>
              )}

              {/* Callout box wrapper */}
              {block.type === 'callout' && (
                <div className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08] border border-indigo-500/20 text-gray-900 dark:text-gray-100">
                  <span className="text-xl select-none">💡</span>
                  <textarea
                    ref={(el) => {
                      blockRefs.current[block.id] = el;
                      adjustTextareaHeight(el);
                    }}
                    value={block.text}
                    readOnly={readOnly}
                    rows={1}
                    onChange={(e) => {
                      handleTextChange(block.id, e.target.value);
                      adjustTextareaHeight(e.target);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="Callout text... Type '/' for options"
                    className="w-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed overflow-hidden"
                  />
                </div>
              )}

              {/* Quote wrapper */}
              {block.type === 'quote' && (
                <div className="w-full border-l-2 border-indigo-500/80 pl-4 py-1 italic text-gray-700 dark:text-neutral-300">
                  <textarea
                    ref={(el) => {
                      blockRefs.current[block.id] = el;
                      adjustTextareaHeight(el);
                    }}
                    value={block.text}
                    readOnly={readOnly}
                    rows={1}
                    onChange={(e) => {
                      handleTextChange(block.id, e.target.value);
                      adjustTextareaHeight(e.target);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="Empty quote..."
                    className="w-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed italic overflow-hidden"
                  />
                </div>
              )}

              {/* Code block */}
              {block.type === 'code' && (
                <div className="w-full rounded-xl bg-[#111113] text-emerald-400 font-mono p-4 border border-white/[0.08] shadow-md">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-sans">
                    <span>Code Snippet</span>
                    <span>JavaScript / SQL</span>
                  </div>
                  <textarea
                    ref={(el) => {
                      blockRefs.current[block.id] = el;
                      adjustTextareaHeight(el);
                    }}
                    value={block.text}
                    readOnly={readOnly}
                    rows={Math.max(2, block.text.split('\n').length)}
                    onChange={(e) => {
                      handleTextChange(block.id, e.target.value);
                      adjustTextareaHeight(e.target);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="// Write or paste code snippet here..."
                    className="w-full bg-transparent resize-none focus:outline-none text-xs font-mono leading-relaxed"
                  />
                </div>
              )}

              {/* Divider line */}
              {block.type === 'divider' && (
                <div className="w-full py-3">
                  <hr className="border-t border-gray-200 dark:border-white/[0.08]" />
                </div>
              )}

              {/* Standard text elements (p, h1, h2, h3, todo, bullet, number) */}
              {['p', 'h1', 'h2', 'h3', 'todo', 'bullet', 'number'].includes(block.type) && (
                <textarea
                  ref={(el) => {
                    blockRefs.current[block.id] = el;
                    adjustTextareaHeight(el, block.type);
                  }}
                  value={block.text}
                  readOnly={readOnly}
                  rows={1}
                  onChange={(e) => {
                    handleTextChange(block.id, e.target.value);
                    adjustTextareaHeight(e.target, block.type);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, block)}
                  placeholder={
                    index === 0 && blocks.length === 1
                      ? "Type '/' for commands or start typing your notes..."
                      : ''
                  }
                  className={`w-full bg-transparent resize-none focus:outline-none overflow-hidden transition-all ${
                    block.type === 'h1'
                      ? 'text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight min-h-[48px] py-1'
                      : block.type === 'h2'
                      ? 'text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white leading-snug min-h-[38px] py-1'
                      : block.type === 'h3'
                      ? 'text-base sm:text-lg font-semibold tracking-tight text-gray-800 dark:text-neutral-100 leading-snug min-h-[32px] py-0.5'
                      : block.type === 'todo' && block.checked
                      ? 'text-sm text-gray-400 dark:text-neutral-500 line-through leading-relaxed min-h-[26px] py-0.5'
                      : 'text-sm text-gray-800 dark:text-neutral-200 leading-relaxed min-h-[26px] py-0.5'
                  }`}
                />
              )}
            </div>

            {/* Slash Command Dropdown Menu */}
            {slashMenu.isOpen && slashMenu.blockIndex === index && (
              <div className="absolute left-6 top-full z-50 w-72 mt-1.5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/[0.08] shadow-2xl overflow-hidden animate-pop-in">
                <div className="p-2.5 border-b border-gray-100 dark:border-white/[0.06] text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Basic Blocks
                </div>
                <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
                  {filteredCommands.length === 0 ? (
                    <div className="p-3 text-center text-xs text-gray-400">
                      No matching blocks
                    </div>
                  ) : (
                    filteredCommands.map((cmd, cIdx) => (
                      <button
                        key={cmd.type}
                        type="button"
                        onClick={() => applyBlockType(index, cmd.type)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-all text-left ${
                          slashMenu.selectedIndex === cIdx
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-white/[0.05] text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.06]">
                          {cmd.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {cmd.label}
                          </div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">
                            {cmd.description}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
