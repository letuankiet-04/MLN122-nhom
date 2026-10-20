import React, { useState } from 'react';
import { StudyNote } from '../../types';
import { Plus, Trash2, Search, Download, ExternalLink, Edit3 } from 'lucide-react';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface NotesManagerProps {
  notes: StudyNote[];
  onSaveNotes: (notes: StudyNote[]) => void;
  bookmarks: string[];
  onToggleBookmark: (bookmarkId: string) => void;
  onOpenPdf?: (page: number) => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes,
  onSaveNotes,
  bookmarks,
  onToggleBookmark,
  onOpenPdf
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newModuleId, setNewModuleId] = useState<string>('module-01');
  const [newPage, setNewPage] = useState<number>(1);

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      moduleId: newModuleId,
      pdfPage: Number(newPage),
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: ['Tự học', 'MLN122'],
      createdAt: new Date().toISOString()
    };

    onSaveNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handleDeleteNote = (noteId: string) => {
    onSaveNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleExportNotes = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ECONVERSE_Study_Notes.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-theme-subtle">
        <div>
          <h4 className="text-lg font-bold text-theme-heading flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-theme-primary" />
            Sổ tay Ghi chú & Đánh dấu học tập (Study Notes)
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Lưu lại những luận điểm quan trọng, liên kết trực tiếp với trang tài liệu PDF gốc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-theme-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm ghi chú</span>
          </button>

          {notes.length > 0 && (
            <button
              type="button"
              onClick={handleExportNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-subtle hover:bg-slate-200/50 dark:hover:bg-slate-800 text-theme-heading border border-theme-subtle rounded-xl text-xs font-medium transition-colors cursor-pointer"
              title="Xuất ghi chú ra tệp JSON"
            >
              <Download className="w-4 h-4" />
              <span>Xuất ghi chú</span>
            </button>
          )}
        </div>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {isCreating && (
        <form onSubmit={handleCreateNote} className="my-4 p-4 sm:p-5 bg-surface-subtle rounded-2xl border border-theme-subtle space-y-3.5">
          <h5 className="text-xs font-bold text-theme-heading">
            Tạo ghi chú mới:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-theme-muted block mb-1">Tiêu đề ghi chú:</label>
              <input
                type="text"
                placeholder="Ví dụ: Phân biệt giá trị xã hội và giá cả thị trường..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-surface border border-theme-subtle rounded-xl text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-theme-muted block mb-1">Thuộc quy luật:</label>
                <select
                  value={newModuleId}
                  onChange={(e) => setNewModuleId(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-theme-subtle rounded-xl text-theme-heading focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="module-01">Khái quát</option>
                  <option value="module-02">Quy luật giá trị</option>
                  <option value="module-03">Quy luật cung – cầu</option>
                  <option value="module-04">Quy luật cạnh tranh</option>
                  <option value="module-05">Quy luật lưu thông tiền tệ</option>
                  <option value="module-06">Mối quan hệ 4 quy luật</option>
                  <option value="module-07">Kết luận & Nhà nước</option>
                </select>
              </div>

              <div className="w-24">
                <label className="text-[11px] text-theme-muted block mb-1">Trang PDF:</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newPage}
                  onChange={(e) => setNewPage(Number(e.target.value))}
                  className="w-full p-2.5 bg-surface border border-theme-subtle rounded-xl text-theme-heading focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-theme-muted block mb-1">Nội dung ghi chú & Luận điểm:</label>
            <textarea
              rows={4}
              placeholder="Ghi lại các ý tưởng, công thức hoặc dẫn chứng cần ghi nhớ..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2.5 text-xs bg-surface border border-theme-subtle rounded-xl text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3.5 py-1.5 border border-theme-subtle rounded-xl text-xs font-medium text-theme-heading hover:bg-surface transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-theme-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              Lưu ghi chú
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative my-4">
        <Search className="w-4 h-4 text-theme-muted absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Tìm kiếm nhanh trong các ghi chú của bạn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-surface-subtle border border-theme-subtle rounded-xl text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-theme-muted text-xs">
          {notes.length === 0
            ? 'Bạn chưa có ghi chú nào. Nhấn "Thêm ghi chú" để lưu lại kiến thức quan trọng!'
            : 'Không tìm thấy ghi chú nào khớp với từ khóa tìm kiếm.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-surface-subtle rounded-2xl border border-theme-subtle flex flex-col justify-between transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="font-bold text-theme-heading text-xs line-clamp-1">
                    {note.title}
                  </h5>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-theme-muted hover:text-rose-500 transition-colors p-1 cursor-pointer"
                    title="Xóa ghi chú"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-theme-body leading-relaxed">
                  <MarkdownRenderer content={note.content} dense />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-theme-muted pt-3 mt-3 border-t border-theme-subtle">
                <span className="font-mono">
                  {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                </span>
                {note.pdfPage && (
                  <button
                    type="button"
                    onClick={() => onOpenPdf?.(note.pdfPage!)}
                    className="hover:text-theme-primary flex items-center gap-1 font-medium text-theme-muted transition-colors cursor-pointer font-mono"
                  >
                    Trang {note.pdfPage} PDF <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
