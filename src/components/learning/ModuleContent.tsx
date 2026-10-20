import React from 'react';
import { LessonModule, StudyMode, UserProgress } from '../../types';
import { CoffeeEfficiencyChart } from '../charts/CoffeeEfficiencyChart';
import { SupplyDemandSimulator } from '../simulations/SupplyDemandSimulator';
import { TetPriceChangeChart } from '../charts/TetPriceChangeChart';
import { EcommerceCompetitionChart } from '../charts/EcommerceCompetitionChart';
import { BusinessStrategySimulator } from '../simulations/BusinessStrategySimulator';
import { MoneyEquationCalculator } from '../simulations/MoneyEquationCalculator';
import { MoneyCirculationChart } from '../charts/MoneyCirculationChart';
import { InteractiveKnowledgeGraph } from './InteractiveKnowledgeGraph';
import {
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../../utils/audio';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface ModuleContentProps {
  module: LessonModule;
  studyMode: StudyMode;
  onChangeStudyMode: (mode: StudyMode) => void;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onOpenPdf: (page: number) => void;
  onNextModule?: () => void;
  onPrevModule?: () => void;
}

export const ModuleContent: React.FC<ModuleContentProps> = ({
  module,
  studyMode,
  onChangeStudyMode,
  progress,
  onUpdateProgress,
  onOpenPdf,
  onNextModule,
  onPrevModule
}) => {
  const isCompleted = progress.completedModules.includes(module.id);
  const isBookmarked = progress.bookmarks.includes(module.id);

  const handleToggleComplete = () => {
    onUpdateProgress((prev) => {
      const alreadyCompleted = prev.completedModules.includes(module.id);
      const newCompleted = alreadyCompleted
        ? prev.completedModules.filter((id) => id !== module.id)
        : [...prev.completedModules, module.id];

      const addedXp = alreadyCompleted ? 0 : 50;
      if (!alreadyCompleted) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        playSuccessChime();
      }

      return {
        ...prev,
        completedModules: newCompleted,
        xp: prev.xp + addedXp
      };
    });
  };

  const handleToggleBookmark = () => {
    onUpdateProgress((prev) => {
      const isMarked = prev.bookmarks.includes(module.id);
      const newBookmarks = isMarked
        ? prev.bookmarks.filter((id) => id !== module.id)
        : [...prev.bookmarks, module.id];
      return { ...prev, bookmarks: newBookmarks };
    });
  };

  return (
    <article className="space-y-6">
      {/* Module Hero Header Card */}
      <div className="bg-surface border border-theme-subtle rounded-2xl p-5 sm:p-7 md:p-8 shadow-theme-card transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-theme-primary tracking-wider uppercase">
                Module {module.number}
              </span>
              <span className="text-theme-faint">·</span>
              <button
                type="button"
                onClick={() => onOpenPdf(module.pdfPages[0])}
                className="text-xs text-theme-muted hover:text-theme-primary flex items-center gap-1 font-medium transition-colors cursor-pointer"
                title="Mở tài liệu PDF gốc tương ứng"
              >
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span>PDF Trang {module.pdfPages.join(', ')}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-theme-heading tracking-tight">
              {module.title}
            </h1>
            <p className="text-xs md:text-sm text-theme-muted mt-1.5 leading-relaxed">
              {module.subtitle}
            </p>
          </div>

          {/* Action Tools: Bookmark / Complete status */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-surface-subtle border-theme-subtle text-theme-muted hover:text-theme-heading hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Đã lưu bài học này' : 'Lưu lại bài học'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleComplete}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-theme-primary hover:bg-blue-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu xong (+50 XP)'}</span>
            </button>
          </div>
        </div>

        {/* Study Mode Switcher Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-1 p-1 bg-surface-subtle border border-theme-subtle rounded-xl text-xs">
            <button
              type="button"
              onClick={() => onChangeStudyMode('full')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                studyMode === 'full'
                  ? 'bg-surface text-theme-primary shadow-xs font-bold'
                  : 'text-theme-muted hover:text-theme-heading'
              }`}
            >
              Học đầy đủ
            </button>
            <button
              type="button"
              onClick={() => onChangeStudyMode('summary')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                studyMode === 'summary'
                  ? 'bg-surface text-theme-primary shadow-xs font-bold'
                  : 'text-theme-muted hover:text-theme-heading'
              }`}
            >
              Học nhanh (Tóm tắt)
            </button>
            <button
              type="button"
              onClick={() => onChangeStudyMode('review')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                studyMode === 'review'
                  ? 'bg-surface text-theme-primary shadow-xs font-bold'
                  : 'text-theme-muted hover:text-theme-heading'
              }`}
            >
              Ôn tập trọng tâm
            </button>
            <button
              type="button"
              onClick={() => onChangeStudyMode('focus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                studyMode === 'focus'
                  ? 'bg-surface text-theme-secondary shadow-xs font-bold'
                  : 'text-theme-muted hover:text-theme-heading'
              }`}
            >
              Tập trung
            </button>
          </div>

          <span className="text-[11px] text-theme-faint font-mono">
            Thời lượng đọc ước tính: ~{module.estimatedMinutes} phút · Trang PDF: {module.pdfPages.join(', ')}
          </span>
        </div>
      </div>

      {/* Sections Content Stream */}
      <div className="space-y-6">
        {module.sections.map((section) => (
          <section
            key={section.id}
            className="bg-surface border border-theme-subtle rounded-2xl p-5 sm:p-7 md:p-8 shadow-theme-card transition-colors"
          >
            <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-theme-subtle">
              <h2 className="text-lg md:text-xl font-bold text-theme-heading tracking-tight">
                {section.title}
              </h2>

              <button
                type="button"
                onClick={() => onOpenPdf(section.pdfPage)}
                className="text-xs text-theme-muted hover:text-theme-primary flex items-center gap-1 font-mono shrink-0 transition-colors cursor-pointer"
                title="Đối chiếu nguyên văn trang tài liệu PDF"
              >
                Trang {section.pdfPage} PDF <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Display according to Study Mode using MarkdownRenderer */}
            {studyMode === 'summary' ? (
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl space-y-2">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Tóm tắt cốt lõi từ tài liệu gốc:
                </span>
                <MarkdownRenderer content={section.summary} />
                <button
                  type="button"
                  onClick={() => onChangeStudyMode('full')}
                  className="text-xs text-theme-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                >
                  Xem toàn bộ nội dung phân tích chi tiết →
                </button>
              </div>
            ) : (
              <MarkdownRenderer content={section.content} />
            )}

            {/* Key Takeaways Box */}
            <div className="mt-6 pt-4 border-t border-theme-subtle">
              <span className="text-xs font-bold text-theme-heading flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
                Luận điểm cốt lõi cần ghi nhớ:
              </span>
              <ul className="space-y-2 pl-1">
                {section.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-theme-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-primary shrink-0 mt-1.5"></span>
                    <div className="flex-1">
                      <MarkdownRenderer content={takeaway} dense />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Citation footnote */}
            {section.citation && (
              <div className="mt-4 pt-3 border-t border-theme-subtle text-[11px] text-theme-faint italic font-mono">
                Trích dẫn học thuật: {section.citation}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Embedded Dynamic Interactive Component */}
      {module.id === 'module-01' && <InteractiveKnowledgeGraph />}

      {module.id === 'module-02' && (
        <CoffeeEfficiencyChart onOpenPdf={onOpenPdf} />
      )}

      {module.id === 'module-03' && (
        <>
          <SupplyDemandSimulator />
          <TetPriceChangeChart onOpenPdf={onOpenPdf} />
        </>
      )}

      {module.id === 'module-04' && (
        <>
          <EcommerceCompetitionChart onOpenPdf={onOpenPdf} />
          <BusinessStrategySimulator />
        </>
      )}

      {module.id === 'module-05' && (
        <>
          <MoneyEquationCalculator />
          <MoneyCirculationChart onOpenPdf={onOpenPdf} />
        </>
      )}

      {module.id === 'module-06' && <InteractiveKnowledgeGraph />}

      {/* Bottom Module Navigation */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <button
          type="button"
          onClick={onPrevModule}
          disabled={!onPrevModule}
          className="flex items-center gap-2 px-4 py-2 border border-theme-subtle hover:border-theme-strong rounded-xl text-xs font-semibold text-theme-heading disabled:opacity-30 hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Module trước</span>
        </button>

        <button
          type="button"
          onClick={onNextModule}
          disabled={!onNextModule}
          className="flex items-center gap-2 px-5 py-2 bg-theme-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-30 transition-colors shadow-xs cursor-pointer"
        >
          <span>Tiếp tục Module sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
