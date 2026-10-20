import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { playTimerFinishChime } from '../../utils/audio';

interface PomodoroTimerProps {
  totalStudySeconds: number;
  onAddStudySeconds: (seconds: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  totalStudySeconds,
  onAddStudySeconds,
}) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workMinutes] = useState<number>(25);
  const [breakMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playTimerFinishChime();
            if (mode === 'work') {
              onAddStudySeconds(workMinutes * 60);
              setMode('break');
              return breakMinutes * 60;
            } else {
              setMode('work');
              return workMinutes * 60;
            }
          }
          if (mode === 'work') {
            onAddStudySeconds(1);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, workMinutes, breakMinutes, onAddStudySeconds]);

  const toggleRunning = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = mode === 'work'
    ? ((workMinutes * 60 - timeLeft) / (workMinutes * 60)) * 100
    : ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100;

  const totalHours = (totalStudySeconds / 3600).toFixed(1);

  return (
    <div className="bg-surface rounded-2xl p-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
        <h4 className="text-xs font-bold text-theme-heading flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-theme-primary" />
          Phiên Pomodoro
        </h4>

        {/* Mode Switcher */}
        <div className="flex p-0.5 bg-surface-subtle border border-theme-subtle rounded-xl text-xs">
          <button
            type="button"
            onClick={() => switchMode('work')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
              mode === 'work'
                ? 'bg-surface text-theme-primary shadow-2xs font-bold'
                : 'text-theme-muted hover:text-theme-heading'
            }`}
          >
            Học (25m)
          </button>
          <button
            type="button"
            onClick={() => switchMode('break')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
              mode === 'break'
                ? 'bg-surface text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold'
                : 'text-theme-muted hover:text-theme-heading'
            }`}
          >
            Nghỉ (5m)
          </button>
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="py-4 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-200 dark:text-slate-800 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`${mode === 'work' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-500'} stroke-current transition-all duration-300`}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={(2 * Math.PI * 44) * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tight text-theme-heading tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-theme-muted capitalize mt-0.5">
              {mode === 'work' ? 'Tập trung' : 'Nghỉ ngơi'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 mt-4">
          <button
            type="button"
            onClick={toggleRunning}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-theme-primary hover:bg-blue-700'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</span>
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 border border-theme-subtle rounded-xl text-theme-muted hover:text-theme-heading hover:bg-surface-subtle transition-colors cursor-pointer"
            title="Đặt lại đồng hồ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pt-2.5 border-t border-theme-subtle flex justify-between items-center text-[11px] text-theme-muted">
        <span>Tích lũy:</span>
        <span className="font-mono font-bold text-theme-heading">
          {totalHours}h ({Math.floor(totalStudySeconds / 60)}m)
        </span>
      </div>
    </div>
  );
};
