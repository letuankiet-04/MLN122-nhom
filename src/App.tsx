/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LESSON_MODULES } from './data/lessonsData';
import { StudyMode, UserProgress, StudyNote } from './types';
import {
  loadUserProgress,
  saveUserProgress,
  loadNotes,
  saveNotes
} from './utils/storage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { ModuleContent } from './components/learning/ModuleContent';
import { FlashcardDeck } from './components/flashcards/FlashcardDeck';
import { QuizRunner } from './components/quiz/QuizRunner';
import { InteractiveMindmap } from './components/mindmap/InteractiveMindmap';
import { NotesManager } from './components/notes/NotesManager';
import { AnalyticsDashboard } from './components/gamification/AnalyticsDashboard';
import { ReferencesView } from './components/learning/ReferencesView';
import { PomodoroTimer } from './components/timer/PomodoroTimer';
import { PdfViewerModal } from './components/layout/PdfViewerModal';
import { SearchModal } from './components/search/SearchModal';
import { PresentationView } from './components/presentation/PresentationView';
import { AiStudyAssistant } from './components/assistant/AiStudyAssistant';
import {
  Layers,
  BookOpen,
  HelpCircle,
  Clock,
  TrendingUp,
  Bookmark,
  Edit3,
  CheckCircle2,
  PanelRightClose,
  PanelRightOpen,
  Save,
  Trash2
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeModuleId, setActiveModuleId] = useState<string>('module-01');
  const [studyMode, setStudyMode] = useState<StudyMode>('full');

  // Persistence
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [notes, setNotes] = useState<StudyNote[]>(loadNotes);

  // Modals & Panels
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [pdfInitialPage, setPdfInitialPage] = useState<number>(1);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [showRightTools, setShowRightTools] = useState<boolean>(true);
  const [quickNoteText, setQuickNoteText] = useState<string>('');

  // Sync progress
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Sync notes
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenPdf = (page: number = 1) => {
    setPdfInitialPage(page);
    setIsPdfOpen(true);
  };

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setCurrentTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = () => {
    setActiveModuleId('module-01');
    setCurrentTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentModule = LESSON_MODULES.find((m) => m.id === activeModuleId) || LESSON_MODULES[0];
  const currentModuleIndex = LESSON_MODULES.findIndex((m) => m.id === activeModuleId);

  const handleNextModule = currentModuleIndex < LESSON_MODULES.length - 1
    ? () => {
        const nextMod = LESSON_MODULES[currentModuleIndex + 1];
        setActiveModuleId(nextMod.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    : undefined;

  const handlePrevModule = currentModuleIndex > 0
    ? () => {
        const prevMod = LESSON_MODULES[currentModuleIndex - 1];
        setActiveModuleId(prevMod.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    : undefined;

  const handleAddStudySeconds = (seconds: number) => {
    setProgress((prev) => ({
      ...prev,
      totalStudySeconds: prev.totalStudySeconds + seconds
    }));
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) return;
    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      moduleId: currentModule.id,
      title: `Ghi chú ${currentModule.title}`,
      content: quickNoteText.trim(),
      pdfPage: currentModule.pdfPages[0],
      createdAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
    setQuickNoteText('');
  };

  const moduleNotes = notes.filter((n) => n.moduleId === currentModule.id);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-theme-body transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPdf={() => handleOpenPdf(1)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Tab 1: Home View */}
        {currentTab === 'home' && (
          <HomeView
            progress={progress}
            onSelectModule={handleSelectModule}
            onStartLearning={handleStartLearning}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {/* Tab 2: Lessons View (Confirmed 3-Column Study Workspace) */}
        {currentTab === 'lessons' && (
          <div>
            {/* Header Toolbar for Study Workspace */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-theme-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-theme-heading">
                  Không gian học tập chuyên sâu
                </span>
                <span className="text-theme-faint">·</span>
                <span className="text-xs text-theme-muted font-mono">
                  {currentModule.title} (Module {currentModule.number})
                </span>
              </div>

              {/* Right tools toggle button */}
              <button
                type="button"
                onClick={() => setShowRightTools((prev) => !prev)}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-theme-subtle hover:border-theme-strong text-theme-muted hover:text-theme-heading transition-colors cursor-pointer"
                title={showRightTools ? 'Ẩn bảng công cụ học tập' : 'Hiện bảng công cụ học tập'}
              >
                {showRightTools ? (
                  <>
                    <PanelRightClose className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Ẩn công cụ</span>
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Mở công cụ</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Column 1: Left Module Navigation TOC (3 cols) */}
              <aside className="lg:col-span-3 space-y-4">
                <div className="bg-surface border border-theme-subtle rounded-2xl p-4 shadow-theme-card sticky top-24">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-theme-subtle">
                    <span className="text-xs font-bold text-theme-heading uppercase tracking-wider">
                      Mục lục Module
                    </span>
                    <span className="text-[11px] font-mono text-theme-muted">
                      {progress.completedModules.length}/{LESSON_MODULES.length} xong
                    </span>
                  </div>

                  <div className="space-y-1">
                    {LESSON_MODULES.map((mod) => {
                      const isSelected = mod.id === activeModuleId;
                      const isDone = progress.completedModules.includes(mod.id);

                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => handleSelectModule(mod.id)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-theme-primary text-white font-bold shadow-xs'
                              : 'hover:bg-surface-subtle text-theme-heading'
                          }`}
                        >
                          <div className="flex items-center gap-2 line-clamp-1">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white font-bold'
                                : isDone
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                                : 'bg-surface-subtle text-theme-muted border border-theme-subtle'
                            }`}>
                              {isDone ? '✓' : mod.number}
                            </span>
                            <span className="truncate">{mod.title}</span>
                          </div>

                          <span className={`text-[10px] font-mono shrink-0 ml-1.5 ${isSelected ? 'text-blue-100' : 'text-theme-faint'}`}>
                            Tr.{mod.pdfPages[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* PDF quick jump */}
                  <div className="mt-4 pt-3 border-t border-theme-subtle">
                    <button
                      type="button"
                      onClick={() => handleOpenPdf(currentModule.pdfPages[0])}
                      className="w-full py-2 px-3 rounded-xl bg-surface-subtle hover:bg-slate-200/50 dark:hover:bg-slate-800 text-theme-heading text-xs font-semibold flex items-center justify-center gap-2 border border-theme-subtle transition-colors cursor-pointer"
                    >
                      <span>Xem PDF Trang {currentModule.pdfPages[0]}</span>
                    </button>
                  </div>
                </div>
              </aside>

              {/* Column 2: Middle Study Content Stage */}
              <div className={`${showRightTools ? 'lg:col-span-9 xl:col-span-6' : 'lg:col-span-9'} transition-all`}>
                <ModuleContent
                  module={currentModule}
                  studyMode={studyMode}
                  onChangeStudyMode={setStudyMode}
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onOpenPdf={handleOpenPdf}
                  onNextModule={handleNextModule}
                  onPrevModule={handlePrevModule}
                />
              </div>

              {/* Column 3: Right Study Tools Panel (Mini Pomodoro, Notes scratchpad, Quick stats) */}
              {showRightTools && (
                <aside className="lg:col-span-12 xl:col-span-3 space-y-5 sticky top-24">
                  {/* Focus Timer */}
                  <div className="bg-surface border border-theme-subtle rounded-2xl p-4 shadow-theme-card">
                    <div className="flex items-center gap-2 pb-3 mb-3 border-b border-theme-subtle">
                      <Clock className="w-4 h-4 text-theme-primary" />
                      <span className="text-xs font-bold text-theme-heading">
                        Đồng hồ tập trung Focus
                      </span>
                    </div>
                    <PomodoroTimer
                      totalStudySeconds={progress.totalStudySeconds}
                      onAddStudySeconds={handleAddStudySeconds}
                    />
                  </div>

                  {/* Quick Notes Scratchpad for current module */}
                  <div className="bg-surface border border-theme-subtle rounded-2xl p-4 shadow-theme-card space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                      <span className="text-xs font-bold text-theme-heading flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-theme-secondary" />
                        Ghi chú bài học này
                      </span>
                      <span className="text-[11px] font-mono text-theme-faint">
                        {moduleNotes.length} ghi chú
                      </span>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        value={quickNoteText}
                        onChange={(e) => setQuickNoteText(e.target.value)}
                        placeholder="Ghi nhanh ý tưởng, thắc mắc hoặc công thức..."
                        rows={3}
                        className="w-full p-2.5 text-xs rounded-xl bg-surface-subtle border border-theme-subtle text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleSaveQuickNote}
                        disabled={!quickNoteText.trim()}
                        className="w-full py-1.5 px-3 bg-theme-secondary hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu ghi chú</span>
                      </button>
                    </div>

                    {/* Saved Notes list for this module */}
                    {moduleNotes.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-theme-subtle max-h-48 overflow-y-auto pr-1">
                        {moduleNotes.map((note) => (
                          <div
                            key={note.id}
                            className="p-2.5 rounded-xl bg-surface-subtle border border-theme-subtle text-xs space-y-1 relative group"
                          >
                            <p className="text-theme-body leading-relaxed whitespace-pre-wrap">
                              {note.content}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-theme-faint pt-1">
                              <span>Trang {note.pdfPage} PDF</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setNotes((prev) => prev.filter((n) => n.id !== note.id))
                                }
                                className="text-red-500 hover:text-red-700 opacity-60 hover:opacity-100 transition-opacity"
                                title="Xóa ghi chú"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Flashcards */}
        {currentTab === 'flashcards' && (
          <div className="max-w-4xl mx-auto">
            <FlashcardDeck
              progress={progress}
              onUpdateProgress={setProgress}
              onOpenPdf={handleOpenPdf}
            />
          </div>
        )}

        {/* Tab 4: Quiz & Exam */}
        {currentTab === 'quiz' && (
          <div className="max-w-4xl mx-auto">
            <QuizRunner
              progress={progress}
              onUpdateProgress={setProgress}
              onOpenPdf={handleOpenPdf}
            />
          </div>
        )}

        {/* Tab 5: Mindmap */}
        {currentTab === 'mindmap' && (
          <div className="max-w-6xl mx-auto">
            <InteractiveMindmap
              onSelectModule={handleSelectModule}
              onOpenPdf={handleOpenPdf}
            />
          </div>
        )}

        {/* Tab 6: Notes & Bookmarks */}
        {currentTab === 'notes' && (
          <div className="max-w-5xl mx-auto">
            <NotesManager
              notes={notes}
              onSaveNotes={setNotes}
              bookmarks={progress.bookmarks}
              onToggleBookmark={(bm) =>
                setProgress((p) => ({
                  ...p,
                  bookmarks: p.bookmarks.includes(bm)
                    ? p.bookmarks.filter((b) => b !== bm)
                    : [...p.bookmarks, bm]
                }))
              }
              onOpenPdf={handleOpenPdf}
            />
          </div>
        )}

        {/* Tab 7: Analytics Dashboard */}
        {currentTab === 'analytics' && (
          <div className="max-w-5xl mx-auto">
            <AnalyticsDashboard
              progress={progress}
              onSelectModule={handleSelectModule}
            />
          </div>
        )}

        {/* Tab 8: References */}
        {currentTab === 'references' && (
          <div className="max-w-4xl mx-auto">
            <ReferencesView onOpenPdf={handleOpenPdf} />
          </div>
        )}
      </main>

      {/* Floating Utilities */}
      <AiStudyAssistant
        currentModuleTitle={currentModule.title}
        onOpenPdf={handleOpenPdf}
      />

      {/* Side-by-side or Modal PDF Viewer */}
      <PdfViewerModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        initialPage={pdfInitialPage}
      />

      {/* Spotlight Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectModule={handleSelectModule}
        onOpenPdf={handleOpenPdf}
      />

      {/* Full-Screen Presentation Mode */}
      {isPresentationOpen && (
        <PresentationView
          onClose={() => setIsPresentationOpen(false)}
          onOpenPdf={handleOpenPdf}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-theme-subtle flex items-center justify-around py-2 px-1 transition-colors">
        <button
          type="button"
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer ${
            currentTab === 'home' ? 'text-theme-primary font-bold' : 'text-theme-muted'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tổng quan</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('lessons')}
          className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer ${
            currentTab === 'lessons' ? 'text-theme-primary font-bold' : 'text-theme-muted'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài học</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('flashcards')}
          className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer ${
            currentTab === 'flashcards' ? 'text-theme-primary font-bold' : 'text-theme-muted'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Flashcard</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('quiz')}
          className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer ${
            currentTab === 'quiz' ? 'text-theme-primary font-bold' : 'text-theme-muted'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Luyện thi</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center gap-0.5 text-[10px] cursor-pointer ${
            currentTab === 'analytics' ? 'text-theme-primary font-bold' : 'text-theme-muted'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tiến độ</span>
        </button>
      </nav>

      {/* Footer */}
      <Footer onOpenPdf={handleOpenPdf} />
    </div>
  );
}
