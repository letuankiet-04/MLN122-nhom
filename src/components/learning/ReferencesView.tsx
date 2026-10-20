import React, { useState } from 'react';
import { ACADEMIC_REFERENCES } from '../../data/referencesData';
import { AcademicReference } from '../../types';
import { BookOpen, Copy, Check, ExternalLink } from 'lucide-react';

export const ReferencesView: React.FC<{ onOpenPdf?: (page: number) => void }> = ({ onOpenPdf }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyCitation = (ref: AcademicReference) => {
    let citation = `${ref.authors} (${ref.year}). ${ref.title}.`;
    if (ref.publication) citation += ` ${ref.publication}.`;
    if (ref.volumeIssue) citation += ` ${ref.volumeIssue}.`;
    if (ref.url) citation += ` ${ref.url}`;

    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(ref.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-6 md:p-8 shadow-theme-card space-y-6 transition-colors">
      <div className="pb-4 border-b border-theme-subtle">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-theme-primary tracking-wider uppercase">
            Tài liệu tham khảo · Trang 11-12 PDF
          </span>
        </div>
        <h2 className="text-2xl font-black text-theme-heading tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-theme-primary" />
          Danh mục 10 nguồn tài liệu tham khảo chính thức (REFERENCE)
        </h2>
        <p className="text-xs text-theme-muted mt-1">
          Đầy đủ 10 nguồn học thuật được trích dẫn trong file PDF môn Kinh tế chính trị Mác – Lênin (MLN122). Hỗ trợ mở liên kết gốc và sao chép định dạng APA.
        </p>
      </div>

      <div className="space-y-4">
        {ACADEMIC_REFERENCES.map((ref) => {
          const isCopied = copiedId === ref.id;

          return (
            <div
              key={ref.id}
              className="p-4 sm:p-5 bg-surface-subtle rounded-2xl border border-theme-subtle flex flex-col md:flex-row items-start justify-between gap-4 group transition-colors"
            >
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-theme-primary text-sm">
                    [{ref.id}]
                  </span>
                  <span className="font-bold text-theme-heading">
                    {ref.authors} ({ref.year}).
                  </span>
                </div>

                <div className="text-theme-heading font-medium italic">
                  {ref.title}.
                </div>

                {ref.publication && (
                  <div className="text-theme-muted">
                    {ref.publication} {ref.volumeIssue ? `· ${ref.volumeIssue}` : ''}
                  </div>
                )}

                <p className="text-[11px] text-theme-muted leading-relaxed pt-1">
                  <strong className="text-theme-heading">Nội dung trích dẫn:</strong> {ref.summary}
                </p>

                {/* PDF cited pages */}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-theme-faint">
                  <span>Trang trích dẫn trong PDF:</span>
                  {ref.pdfPagesCited.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onOpenPdf?.(p)}
                      className="text-theme-primary font-mono hover:underline font-semibold cursor-pointer"
                    >
                      Tr.{p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                <button
                  type="button"
                  onClick={() => handleCopyCitation(ref)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-surface border-theme-subtle text-theme-heading hover:border-theme-strong'
                  }`}
                  title="Sao chép trích dẫn chuẩn APA"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Đã chép' : 'Chép trích dẫn'}</span>
                </button>

                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-theme-primary-subtle text-theme-primary border border-theme-primary/20 text-[11px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    <span>Mở nguồn gốc</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
