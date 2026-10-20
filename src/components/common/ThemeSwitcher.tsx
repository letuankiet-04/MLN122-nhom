import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

interface ThemeOption {
  mode: ThemeMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const THEME_OPTIONS: ThemeOption[] = [
  { mode: 'light', label: 'Chế độ Sáng (Light)', icon: Sun },
  { mode: 'system', label: 'Tự động theo hệ thống (System)', icon: Monitor },
  { mode: 'dark', label: 'Chế độ Tối (Dark)', icon: Moon },
];

export const ThemeSwitcher: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Chọn giao diện hiển thị"
      className={`relative inline-flex items-center p-0.5 sm:p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-xl transition-colors ${className}`}
    >
      {THEME_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = themeMode === opt.mode;

        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setThemeMode(opt.mode)}
            className={`relative z-10 flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
              compact ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'
            } ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs font-semibold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/40'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="sr-only">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
