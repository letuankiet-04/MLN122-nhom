import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { QuizQuestion, UserProgress } from '../../types';
import { CheckCircle2, XCircle, Clock, Award, RotateCcw, ArrowRight, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../../utils/audio';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface QuizRunnerProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onOpenPdf?: (page: number) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ progress, onUpdateProgress, onOpenPdf }) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [quizList, setQuizList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(600);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState<boolean>(false);

  const startQuiz = (onlyMistakes = false) => {
    let pool = QUIZ_QUESTIONS;
    if (selectedModule !== 'all') {
      pool = pool.filter((q) => q.moduleId === selectedModule);
    }

    if (onlyMistakes) {
      const lastResult = progress.quizResults[progress.quizResults.length - 1];
      if (lastResult && lastResult.mistakeQuestionIds.length > 0) {
        pool = QUIZ_QUESTIONS.filter((q) => lastResult.mistakeQuestionIds.includes(q.id));
      }
      setIsReviewingMistakes(true);
    } else {
      setIsReviewingMistakes(false);
    }

    setQuizList(pool);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeRemainingSeconds(Math.max(180, pool.length * 60));
    setIsExamMode(true);
  };

  useEffect(() => {
    if (!isExamMode || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamMode, isSubmitted]);

  const currentQ = quizList[currentIndex];

  const handleSelectOption = (answer: any) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: answer
    }));
  };

  const handleToggleMultiple = (optionIndex: number) => {
    if (isSubmitted) return;
    const current = (userAnswers[currentQ.id] as number[]) || [];
    const exists = current.includes(optionIndex);
    const updated = exists ? current.filter((i) => i !== optionIndex) : [...current, optionIndex].sort();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: updated
    }));
  };

  const calculateScore = () => {
    let score = 0;
    const mistakes: string[] = [];

    quizList.forEach((q) => {
      const userAns = userAnswers[q.id];
      let isCorrect = false;

      if (q.type === 'single' || q.type === 'case_study' || q.type === 'true_false') {
        isCorrect = userAns === q.correctAnswer;
      } else if (q.type === 'multiple') {
        const correctArray = (q.correctAnswer as number[]).sort();
        const userArray = ((userAns as number[]) || []).sort();
        isCorrect = JSON.stringify(correctArray) === JSON.stringify(userArray);
      } else if (q.type === 'fill_blank') {
        isCorrect = typeof userAns === 'string' && userAns.trim().toLowerCase() === (q.correctAnswer as string).toLowerCase();
      } else if (q.type === 'matching') {
        isCorrect = userAns === 'matched';
      } else if (q.type === 'essay') {
        isCorrect = Boolean(userAns && userAns.trim().length > 30);
      }

      if (isCorrect) {
        score++;
      } else {
        mistakes.push(q.id);
      }
    });

    return { score, total: quizList.length, mistakes };
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const { score, total, mistakes } = calculateScore();
    const percentage = Math.round((score / total) * 100);
    const xpEarned = score * 20;

    if (percentage >= 70) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      playSuccessChime();
    }

    onUpdateProgress((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      quizResults: [
        ...prev.quizResults,
        {
          quizId: `quiz-${Date.now()}`,
          score,
          total,
          percentage,
          timestamp: Date.now(),
          mistakeQuestionIds: mistakes
        }
      ]
    }));
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isExamMode) {
    const lastResult = progress.quizResults[progress.quizResults.length - 1];

    return (
      <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card transition-colors">
        <div className="pb-4 border-b border-theme-subtle">
          <h4 className="text-lg font-bold text-theme-heading">
            Hệ thống trắc nghiệm & Luyện thi MLN122
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Ngân hàng câu hỏi đa dạng: Trắc nghiệm 1 đáp án, nhiều đáp án, đúng/sai, điền khuyết, ghép thuật ngữ và tình huống thực tiễn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl">
            <span className="text-xs text-theme-primary font-bold block">Tổng số câu trong kho:</span>
            <span className="text-2xl font-black text-theme-heading font-mono mt-1 block">
              {QUIZ_QUESTIONS.length} câu hỏi
            </span>
            <span className="text-[11px] text-theme-muted mt-1 block">Bám sát 100% nội dung 12 trang PDF</span>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">Lần thi gần nhất:</span>
            <span className="text-2xl font-black text-theme-heading font-mono mt-1 block">
              {lastResult ? `${lastResult.score}/${lastResult.total} (${lastResult.percentage}%)` : 'Chưa thi'}
            </span>
            <span className="text-[11px] text-theme-muted mt-1 block">
              {lastResult ? `${new Date(lastResult.timestamp).toLocaleDateString('vi-VN')}` : 'Hãy bắt đầu làm bài'}
            </span>
          </div>

          <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 rounded-xl">
            <span className="text-xs text-theme-secondary font-bold block">Phần thưởng XP:</span>
            <span className="text-2xl font-black text-theme-heading font-mono mt-1 block">
              +20 XP
            </span>
            <span className="text-[11px] text-theme-muted mt-1 block">Cho mỗi câu trả lời chính xác</span>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="p-4 bg-surface-subtle rounded-xl border border-theme-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label htmlFor="quiz-module-select" className="text-xs font-semibold text-theme-heading">
              Chọn phạm vi ôn tập:
            </label>
            <select
              id="quiz-module-select"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="text-xs bg-surface border border-theme-subtle rounded-xl px-3 py-2 text-theme-heading focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Toàn bộ đề thi (Tổng hợp 4 quy luật)</option>
              <option value="module-01">Module 01: Khái quát nền kinh tế hàng hóa</option>
              <option value="module-02">Module 02: Quy luật giá trị & Nghiên cứu cà phê</option>
              <option value="module-03">Module 03: Quy luật cung – cầu & Thị trường Tết 2025</option>
              <option value="module-04">Module 04: Quy luật cạnh tranh & Shopee vs TikTok</option>
              <option value="module-05">Module 05: Quy luật lưu thông tiền tệ & Kinh tế 2025</option>
              <option value="module-06">Module 06: Mối quan hệ giữa 4 quy luật</option>
              <option value="module-07">Module 07: Kết luận & Quản lý của Nhà nước</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => startQuiz(false)}
              className="px-5 py-2.5 bg-theme-primary hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Bắt đầu làm bài thi ({selectedModule === 'all' ? QUIZ_QUESTIONS.length : QUIZ_QUESTIONS.filter(q => q.moduleId === selectedModule).length} câu)
            </button>

            {lastResult && lastResult.mistakeQuestionIds.length > 0 && (
              <button
                type="button"
                onClick={() => startQuiz(true)}
                className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm lại các câu sai lần trước ({lastResult.mistakeQuestionIds.length} câu)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Submitted View
  if (isSubmitted) {
    const { score, total } = calculateScore();
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card transition-colors">
        <div className="text-center py-6 border-b border-theme-subtle">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-theme-primary-subtle text-theme-primary flex items-center justify-center mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-theme-heading">
            Kết quả bài làm: {score} / {total} câu đúng
          </h3>
          <p className="text-sm font-semibold text-theme-primary mt-1">
            Đạt {percentage}% · Thưởng +{score * 20} XP
          </p>
          <div className="flex justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => setIsExamMode(false)}
              className="px-4 py-2 border border-theme-subtle rounded-xl text-xs font-semibold text-theme-heading hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Về bảng điều khiển
            </button>
            <button
              type="button"
              onClick={() => startQuiz(false)}
              className="px-4 py-2 bg-theme-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Làm lại bài thi mới
            </button>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-bold text-theme-heading">
            Chi tiết giải thích và đáp án từng câu:
          </h4>

          {quizList.map((q, idx) => {
            const userAns = userAnswers[q.id];
            let isCorrect = false;
            if (q.type === 'single' || q.type === 'case_study' || q.type === 'true_false') {
              isCorrect = userAns === q.correctAnswer;
            } else if (q.type === 'multiple') {
              isCorrect = JSON.stringify((q.correctAnswer as number[]).sort()) === JSON.stringify(((userAns as number[]) || []).sort());
            } else if (q.type === 'fill_blank') {
              isCorrect = typeof userAns === 'string' && userAns.trim().toLowerCase() === (q.correctAnswer as string).toLowerCase();
            } else if (q.type === 'matching' || q.type === 'essay') {
              isCorrect = true;
            }

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border text-xs transition-colors ${
                  isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-rose-500/40 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-bold text-theme-heading">
                      Câu {idx + 1}: {q.question}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenPdf?.(q.pdfPage)}
                    className="text-[11px] text-theme-muted hover:text-theme-primary flex items-center gap-1 shrink-0 cursor-pointer font-mono"
                  >
                    Trang {q.pdfPage} PDF <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 bg-surface rounded-xl border border-theme-subtle text-theme-body space-y-1.5 mt-2">
                  <div>
                    <span className="font-bold text-theme-heading block mb-1">Giải thích chi tiết: </span>
                    <MarkdownRenderer content={q.explanation} dense />
                  </div>
                  {q.rubric && (
                    <div className="mt-2 pt-2 border-t border-theme-subtle">
                      <span className="font-bold text-theme-heading block mb-1">
                        Tiêu chí chấm điểm (Rubric):
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-[11px]">
                        {q.rubric.map((r, i) => (
                          <li key={i}>
                            <MarkdownRenderer content={r} dense />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card transition-colors">
      {/* Quiz Top bar: Counter & Timer */}
      <div className="flex items-center justify-between pb-4 border-b border-theme-subtle">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-theme-primary-subtle text-theme-primary">
            Câu {currentIndex + 1} / {quizList.length}
          </span>
          {isReviewingMistakes && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              (Chế độ ôn lại câu sai)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-theme-heading bg-surface-subtle px-3 py-1.5 rounded-xl border border-theme-subtle">
            <Clock className="w-3.5 h-3.5 text-theme-primary" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenPdf?.(currentQ.pdfPage)}
            className="text-xs text-theme-muted hover:text-theme-primary flex items-center gap-1 cursor-pointer font-mono"
          >
            Trang {currentQ.pdfPage} <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="py-6">
        <div className="text-base md:text-lg font-bold text-theme-heading mb-4 leading-relaxed">
          <MarkdownRenderer content={currentQ.question} />
        </div>

        {/* Options */}
        {(currentQ.type === 'single' || currentQ.type === 'case_study') && currentQ.options && (
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = userAnswers[currentQ.id] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-theme-primary bg-theme-primary-subtle font-semibold text-theme-primary shadow-2xs'
                      : 'border-theme-subtle hover:border-theme-strong bg-surface text-theme-body'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] shrink-0 font-bold ${
                    isSelected ? 'border-theme-primary bg-theme-primary text-white' : 'border-theme-subtle text-theme-muted'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <div className="leading-relaxed flex-1">
                    <MarkdownRenderer content={opt} dense />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {currentQ.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4">
            {[true, false].map((val) => {
              const isSelected = userAnswers[currentQ.id] === val;
              return (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => handleSelectOption(val)}
                  className={`p-4 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-theme-primary bg-theme-primary-subtle text-theme-primary shadow-2xs'
                      : 'border-theme-subtle hover:border-theme-strong text-theme-heading bg-surface'
                  }`}
                >
                  {val ? 'ĐÚNG' : 'SAI'}
                </button>
              );
            })}
          </div>
        )}

        {currentQ.type === 'multiple' && currentQ.options && (
          <div className="space-y-2.5">
            <span className="text-[11px] text-theme-muted block mb-1">
              * Câu hỏi có thể chọn nhiều đáp án. Nhấn vào các ô để chọn:
            </span>
            {currentQ.options.map((opt, oIdx) => {
              const selectedArray = (userAnswers[currentQ.id] as number[]) || [];
              const isSelected = selectedArray.includes(oIdx);
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleToggleMultiple(oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-theme-secondary bg-theme-secondary-subtle font-semibold text-theme-secondary'
                      : 'border-theme-subtle hover:border-theme-strong bg-surface text-theme-body'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-theme-secondary bg-theme-secondary text-white' : 'border-theme-subtle text-transparent'
                  }`}>
                    ✓
                  </div>
                  <div className="leading-relaxed flex-1">
                    <MarkdownRenderer content={opt} dense />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {currentQ.type === 'fill_blank' && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nhập từ hoặc cụm từ còn thiếu..."
              value={userAnswers[currentQ.id] || ''}
              onChange={(e) => handleSelectOption(e.target.value)}
              className="w-full max-w-md p-3 text-xs bg-surface-subtle border border-theme-subtle rounded-xl text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {currentQ.type === 'matching' && currentQ.matchingPairs && (
          <div className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle space-y-3">
            <span className="text-xs font-bold text-theme-heading block">
              Bảng ghép nối dữ liệu:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {currentQ.matchingPairs.map((pair, idx) => (
                <div key={idx} className="p-2.5 bg-surface rounded-xl border border-theme-subtle flex justify-between items-center">
                  <span className="font-medium text-theme-heading">{pair.term}</span>
                  <span className="font-bold text-theme-primary">{pair.definition}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleSelectOption('matched')}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                userAnswers[currentQ.id] === 'matched'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-surface border border-theme-subtle text-theme-heading'
              }`}
            >
              {userAnswers[currentQ.id] === 'matched' ? '✓ Đã xác nhận đối chiếu đúng' : 'Nhấn để xác nhận đối chiếu'}
            </button>
          </div>
        )}

        {currentQ.type === 'essay' && (
          <div className="space-y-3">
            <textarea
              rows={6}
              placeholder="Nhập bài phân tích tự luận của bạn theo các luận điểm chính..."
              value={userAnswers[currentQ.id] || ''}
              onChange={(e) => handleSelectOption(e.target.value)}
              className="w-full p-3 text-xs bg-surface-subtle border border-theme-subtle rounded-xl text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
            />
            {currentQ.rubric && (
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs">
                <span className="font-bold text-theme-primary block mb-1">
                  Khung tiêu chí chấm tự luận (Rubric):
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-theme-body">
                  {currentQ.rubric.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-theme-subtle">
        <button
          type="button"
          onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-theme-subtle hover:border-theme-strong rounded-xl text-xs font-semibold text-theme-heading disabled:opacity-40 hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          Câu trước
        </button>

        {currentIndex < quizList.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((idx) => idx + 1)}
            className="px-4 py-2 bg-theme-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitQuiz}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Nộp bài & Chấm điểm
          </button>
        )}
      </div>
    </div>
  );
};
