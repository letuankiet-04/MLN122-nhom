import React from 'react';
import { UserProgress } from '../../types';
import { LESSON_MODULES } from '../../data/lessonsData';
import { FLASHCARDS } from '../../data/flashcardsData';
import { Award, Flame, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalyticsDashboardProps {
  progress: UserProgress;
  onSelectModule: (moduleId: string) => void;
}

const BADGES = [
  { id: 'badge-welcome', title: 'Tân sinh viên Kinh tế', desc: 'Bắt đầu hành trình chinh phục môn MLN122', icon: '🎓' },
  { id: 'badge-value', title: 'Chuyên gia Giá trị', desc: 'Làm chủ lý thuyết hao phí LĐXH và nghiên cứu cà phê 2019', icon: '☕' },
  { id: 'badge-supply-demand', title: 'Bậc thầy Cung Cầu', desc: 'Thấu hiểu cơ chế cân bằng giá Tết Ất Tỵ 2025', icon: '📈' },
  { id: 'badge-competition', title: 'Nhà chiến lược Cạnh tranh', desc: 'Nắm vững case study Shopee - TikTok Shop và Luật Cạnh tranh', icon: '⚔️' },
  { id: 'badge-money', title: 'Hoạch định Tiền tệ', desc: 'Giải mã công thức M = (P×Q)/V và bức tranh vĩ mô 2025', icon: '💵' },
  { id: 'badge-master', title: 'Thủ khoa MLN122', desc: 'Hoàn thành trọn vẹn 100% các module và kiểm tra đánh giá', icon: '🏆' }
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ progress, onSelectModule }) => {
  const completedCount = progress.completedModules.length;
  const totalModules = LESSON_MODULES.length;
  const moduleProgressPercent = Math.round((completedCount / totalModules) * 100);

  const masteredFlashcardCount = progress.masteredFlashcardIds.length;
  const totalFlashcards = FLASHCARDS.length;
  const flashcardPercent = Math.round((masteredFlashcardCount / totalFlashcards) * 100);

  const totalStudyMinutes = Math.floor(progress.totalStudySeconds / 60);

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card my-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-theme-subtle">
        <div>
          <h4 className="text-lg font-bold text-theme-heading flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-theme-primary" />
            Bảng theo dõi tiến độ & Phân tích học tập cá nhân
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Dữ liệu ghi nhận trực tiếp theo hoạt động học tập thực tế của bạn trên nền tảng ECONVERSE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{progress.streakDays} ngày liên tục</span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>{progress.xp} XP</span>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle">
          <span className="text-xs text-theme-muted block">Thời gian học tập:</span>
          <div className="text-2xl font-black text-theme-heading font-mono mt-1 tabular-nums">
            {totalStudyMinutes} <span className="text-xs font-normal text-theme-muted">phút</span>
          </div>
          <span className="text-[11px] text-theme-faint mt-1 block">Tích lũy từ các phiên học</span>
        </div>

        <div className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle">
          <span className="text-xs text-theme-muted block">Tiến độ Module:</span>
          <div className="text-2xl font-black text-theme-primary font-mono mt-1 tabular-nums">
            {completedCount} / {totalModules}
          </div>
          <span className="text-[11px] text-theme-faint mt-1 block">Hoàn thành {moduleProgressPercent}% giáo trình</span>
        </div>

        <div className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle">
          <span className="text-xs text-theme-muted block">Flashcards đã thuộc:</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 tabular-nums">
            {masteredFlashcardCount} / {totalFlashcards}
          </div>
          <span className="text-[11px] text-theme-faint mt-1 block">Đạt {flashcardPercent}% mục tiêu nhớ</span>
        </div>

        <div className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle">
          <span className="text-xs text-theme-muted block">Số bài thi đã làm:</span>
          <div className="text-2xl font-black text-theme-secondary font-mono mt-1 tabular-nums">
            {progress.quizResults.length}
          </div>
          <span className="text-[11px] text-theme-faint mt-1 block">
            {progress.quizResults.length > 0
              ? `Điểm gần nhất: ${progress.quizResults[progress.quizResults.length - 1].percentage}%`
              : 'Chưa tham gia kiểm tra'}
          </span>
        </div>
      </div>

      {/* Module Breakdown & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Status Breakdown */}
        <div className="lg:col-span-7 space-y-2.5">
          <span className="text-xs font-bold text-theme-heading block mb-2">
            Tiến độ chi tiết từng Module học phần:
          </span>
          {LESSON_MODULES.map((mod) => {
            const isCompleted = progress.completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className="p-3.5 bg-surface-subtle hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl border border-theme-subtle flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-surface text-theme-muted border border-theme-subtle'
                  }`}>
                    {isCompleted ? '✓' : mod.number}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-theme-heading group-hover:text-theme-primary transition-colors block">
                      {mod.title}
                    </span>
                    <span className="text-[11px] text-theme-muted font-mono">
                      PDF Trang {mod.pdfPages.join(', ')} · ~{mod.estimatedMinutes} phút
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold ${
                  isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-theme-muted'
                }`}>
                  {isCompleted ? 'Đã hoàn thành' : 'Chưa học'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Gamification Badges & Recent History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle">
            <span className="text-xs font-bold text-theme-heading block mb-3">
              Huy hiệu thành tích (Badges):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BADGES.map((b) => {
                const isEarned = progress.earnedBadgeIds.includes(b.id) ||
                  (b.id === 'badge-master' && completedCount === totalModules);

                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
                      isEarned
                        ? 'border-indigo-500/30 bg-surface'
                        : 'border-theme-subtle opacity-40 bg-surface-subtle'
                    }`}
                  >
                    <div className="text-xl mb-1">{b.icon}</div>
                    <div className="font-bold text-[11px] text-theme-heading line-clamp-1">
                      {b.title}
                    </div>
                    <div className="text-[10px] text-theme-muted line-clamp-2 mt-0.5">
                      {b.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak areas / Review recommendations */}
          {progress.strugglingFlashcardIds.length > 0 && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Nội dung cần ôn tập lại:</span>
              </div>
              <p className="text-amber-900 dark:text-amber-300/90 leading-relaxed text-[11px]">
                Bạn đang có <strong className="text-theme-heading">{progress.strugglingFlashcardIds.length}</strong> thẻ flashcard được đánh dấu chưa nhớ. Hãy vào mục Thẻ ghi nhớ để ôn tập ngắt quãng nhé!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
