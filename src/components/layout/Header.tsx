import React from 'react';
import { Search, FileText, Presentation } from 'lucide-react';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenPdf: () => void;
  onOpenPresentation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenPdf,
  onOpenPresentation,
}) => {
  const navItems = [
    { id: 'home', label: 'Tổng quan' },
    { id: 'lessons', label: 'Bài học' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'Luyện thi' },
    { id: 'mindmap', label: 'Sơ đồ tư duy' },
    { id: 'references', label: 'Tài liệu tham khảo' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 dark:bg-surface/90 backdrop-blur-md border-b border-theme-subtle transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="text-lg sm:text-xl font-black tracking-tight text-theme-heading whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-1 px-1 cursor-pointer"
          aria-label="Về trang chủ ECONVERSE"
        >
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            ECONVERSE
          </span>
        </button>

        {/* Zone 2: 4–6 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-theme-muted">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                  isActive
                    ? 'text-theme-primary bg-theme-primary-subtle font-bold shadow-xs'
                    : 'hover:text-theme-heading hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster with ThemeSwitcher, Search, PDF, Presentation */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Spotlight Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-surface-subtle border border-theme-subtle text-theme-muted rounded-xl text-xs hover:border-theme-strong hover:text-theme-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            title="Tìm kiếm thông minh (Ctrl+K hoặc ⌘K)"
            aria-label="Mở tìm kiếm nhanh"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-xs">Tìm kiếm...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface text-[10px] font-mono border border-theme-subtle">
              ⌘K
            </kbd>
          </button>

          {/* Presentation Mode Button */}
          <button
            type="button"
            onClick={onOpenPresentation}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-heading hover:bg-surface-subtle border border-transparent hover:border-theme-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            title="Chế độ thuyết trình trên lớp"
            aria-label="Mở chế độ thuyết trình"
          >
            <Presentation className="w-4 h-4" />
          </button>

          {/* PDF Viewer Trigger */}
          <button
            type="button"
            onClick={onOpenPdf}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-theme-subtle hover:border-theme-strong hover:bg-surface-subtle rounded-xl text-xs font-semibold text-theme-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            title="Xem tài liệu PDF gốc MLN122"
            aria-label="Mở file PDF giáo trình gốc"
          >
            <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>PDF gốc</span>
          </button>

          {/* Segmented Light / Dark / System Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
