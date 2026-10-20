import React, { useState } from 'react';
import { FLASHCARDS } from '../../data/flashcardsData';
import { Flashcard, UserProgress } from '../../types';
import { RotateCw, Check, X, Shuffle, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../../utils/audio';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface FlashcardDeckProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onOpenPdf?: (page: number) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ progress, onUpdateProgress, onOpenPdf }) => {
  const [filterModule, setFilterModule] = useState<string>('all');
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter cards
  const filteredCards = filterModule === 'all'
    ? cards
    : cards.filter((c) => c.moduleId === filterModule);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleMarkMastered = (cardId: string) => {
    onUpdateProgress((prev) => {
      const alreadyMastered = prev.masteredFlashcardIds.includes(cardId);
      const newMastered = alreadyMastered ? prev.masteredFlashcardIds : [...prev.masteredFlashcardIds, cardId];
      const newStruggling = prev.strugglingFlashcardIds.filter((id) => id !== cardId);
      const addedXp = alreadyMastered ? 0 : 15;

      if (!alreadyMastered && newMastered.length % 5 === 0) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        playSuccessChime();
      }

      return {
        ...prev,
        masteredFlashcardIds: newMastered,
        strugglingFlashcardIds: newStruggling,
        xp: prev.xp + addedXp
      };
    });
    handleNext();
  };

  const handleMarkStruggling = (cardId: string) => {
    onUpdateProgress((prev) => {
      const newMastered = prev.masteredFlashcardIds.filter((id) => id !== cardId);
      const newStruggling = prev.strugglingFlashcardIds.includes(cardId)
        ? prev.strugglingFlashcardIds
        : [...prev.strugglingFlashcardIds, cardId];

      return {
        ...prev,
        masteredFlashcardIds: newMastered,
        strugglingFlashcardIds: newStruggling
      };
    });
    handleNext();
  };

  const isMastered = currentCard ? progress.masteredFlashcardIds.includes(currentCard.id) : false;
  const isStruggling = currentCard ? progress.strugglingFlashcardIds.includes(currentCard.id) : false;

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card transition-colors">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div>
          <h4 className="text-lg font-bold text-theme-heading">
            Thẻ ghi nhớ thông minh (Flashcards)
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Lật thẻ 3D, đánh giá mức độ ghi nhớ và ôn tập ngắt quãng (Spaced Repetition).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Module Filter Select */}
          <select
            value={filterModule}
            onChange={(e) => {
              setFilterModule(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="text-xs bg-surface-subtle border border-theme-subtle rounded-xl px-3 py-1.5 text-theme-heading focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả quy luật ({cards.length})</option>
            <option value="module-01">Khái quát chung</option>
            <option value="module-02">Quy luật giá trị</option>
            <option value="module-03">Quy luật cung – cầu</option>
            <option value="module-04">Quy luật cạnh tranh</option>
            <option value="module-05">Quy luật lưu thông tiền tệ</option>
            <option value="module-06">Mối quan hệ 4 quy luật</option>
            <option value="module-07">Kết luận & Nhà nước</option>
          </select>

          <button
            type="button"
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-subtle hover:bg-slate-200/50 dark:hover:bg-slate-800 text-theme-heading border border-theme-subtle text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Trộn thẻ</span>
          </button>
        </div>
      </div>

      {/* Progress & Deck Status */}
      <div className="flex items-center justify-between text-xs text-theme-muted pt-4 pb-2">
        <span className="font-bold text-theme-heading font-mono">
          Thẻ {currentIndex + 1} / {filteredCards.length}
        </span>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            ✓ Đã thuộc: {progress.masteredFlashcardIds.length}
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            ? Cần ôn: {progress.strugglingFlashcardIds.length}
          </span>
        </div>
      </div>

      {/* 3D Flipping Card Container */}
      {currentCard && (
        <div className="my-4 [perspective:1000px]">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[300px] md:min-h-[340px] rounded-2xl border transition-all duration-500 [transform-style:preserve-3d] cursor-pointer relative shadow-theme-card hover:shadow-theme-elevated ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            } ${
              isMastered
                ? 'border-emerald-500/40 bg-surface'
                : isStruggling
                ? 'border-amber-500/40 bg-surface'
                : 'border-theme-subtle bg-surface'
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 [backface-visibility:hidden] p-6 md:p-8 flex flex-col justify-between rounded-2xl bg-surface">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-theme-primary uppercase tracking-wider">
                    Mặt trước · Câu hỏi & Khái niệm
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPdf?.(currentCard.pdfPage);
                    }}
                    className="text-xs text-theme-muted hover:text-theme-primary flex items-center gap-1 cursor-pointer font-mono"
                  >
                    Trang {currentCard.pdfPage} PDF <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-lg md:text-xl font-bold text-theme-heading leading-snug">
                  <MarkdownRenderer content={currentCard.question} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-theme-muted pt-4 border-t border-theme-subtle">
                <span className="flex items-center gap-1.5 text-theme-primary font-medium">
                  <RotateCw className="w-3.5 h-3.5" />
                  Nhấn để lật thẻ xem đáp án
                </span>
                <span className="capitalize px-2.5 py-0.5 rounded-lg bg-surface-subtle text-theme-body text-[11px] font-semibold border border-theme-subtle">
                  Mức độ: {currentCard.difficulty}
                </span>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] p-6 md:p-8 flex flex-col justify-between rounded-2xl bg-surface">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Mặt sau · Đáp án theo giáo trình
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPdf?.(currentCard.pdfPage);
                    }}
                    className="text-xs text-theme-muted hover:text-theme-primary flex items-center gap-1 cursor-pointer font-mono"
                  >
                    Xem PDF Trang {currentCard.pdfPage} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-sm md:text-base text-theme-heading mb-3">
                  <MarkdownRenderer content={currentCard.answer} />
                </div>

                <div className="p-3 bg-surface-subtle rounded-xl text-xs border border-theme-subtle">
                  <span className="font-bold text-theme-heading block mb-1">Giải thích chi tiết: </span>
                  <MarkdownRenderer content={currentCard.explanation} dense />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-theme-muted pt-3 border-t border-theme-subtle">
                <span>Nhấn lại để quay về câu hỏi</span>
                <span className="text-[11px] font-mono font-bold text-theme-primary">
                  +15 XP khi ghi nhớ thành công
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons: Struggling / Mastered / Navigation */}
      {currentCard && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleMarkStruggling(currentCard.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Chưa nhớ (Ôn lại)</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkMastered(currentCard.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Đã thuộc vững (+15 XP)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3.5 py-2 border border-theme-subtle hover:border-theme-strong rounded-xl text-xs font-semibold text-theme-heading hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Thẻ trước
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 py-2 border border-theme-subtle hover:border-theme-strong rounded-xl text-xs font-semibold text-theme-heading hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Thẻ tiếp theo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
