import React, { useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  if (!isOpen) return null;

  const pdfUrl = `/assets/aistudio/MLN122_-_CHAP_2__1__9dc5a1b6.pdf#page=${currentPage}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-surface border border-theme-subtle rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-theme-elevated overflow-hidden transition-colors">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-theme-subtle bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 id="pdf-viewer-title" className="text-sm font-bold text-theme-heading">
                Tài liệu gốc: MLN122 - CHAP 2 (1).pdf
              </h3>
              <p className="text-[11px] text-theme-muted">
                12 trang tài liệu chính thức về 4 quy luật kinh tế hàng hóa
              </p>
            </div>
          </div>

          {/* Quick Page Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-surface border border-theme-subtle rounded-xl p-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded-lg hover:bg-surface-subtle disabled:opacity-30 text-theme-heading transition-colors cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-bold px-2 text-theme-heading">
                Trang {currentPage} / 12
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
                disabled={currentPage >= 12}
                className="p-1 rounded-lg hover:bg-surface-subtle disabled:opacity-30 text-theme-heading transition-colors cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href="/assets/aistudio/MLN122_-_CHAP_2__1__9dc5a1b6.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface-subtle border border-theme-subtle text-theme-muted hover:text-theme-heading hover:border-theme-strong transition-colors"
              title="Mở trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-subtle text-theme-muted hover:text-theme-heading transition-colors cursor-pointer"
              title="Đóng modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 relative">
          <iframe
            src={pdfUrl}
            title="Tài liệu gốc MLN122 Chap 2"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};
