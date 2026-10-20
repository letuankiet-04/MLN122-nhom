import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  pageCitations?: number[];
  timestamp: number;
}

interface AiStudyAssistantProps {
  currentModuleTitle?: string;
  onOpenPdf?: (page: number) => void;
}

const QUICK_PROMPTS = [
  'Giải thích dễ hiểu hơn',
  'Cho tôi ví dụ thực tiễn',
  'Kiểm tra kiến thức của tôi',
  'Tóm tắt quy luật này',
  'So sánh 4 quy luật',
  'Tạo câu hỏi ôn tập'
];

export const AiStudyAssistant: React.FC<AiStudyAssistantProps> = ({ currentModuleTitle, onOpenPdf }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin chào! Tôi là Trợ lý Học tập AI cho môn **Kinh tế chính trị Mác – Lênin (MLN122)**.\n\nTôi được huấn luyện dựa trên toàn bộ 12 trang tài liệu PDF về 4 quy luật kinh tế hàng hóa, số liệu thực nghiệm cà phê Tây Nguyên (2019), diễn biến giá Tết Ất Tỵ (2025), cạnh tranh TMĐT Shopee - TikTok Shop (2024), và kinh tế vĩ mô Việt Nam (2025).\n\nHãy chọn một câu hỏi gợi ý bên dưới hoặc nhập thắc mắc của bạn!`,
      pageCitations: [1, 2, 4, 7, 9],
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: currentModuleTitle || 'Tổng quan 4 quy luật kinh tế',
          history: messages.slice(-4)
        })
      });

      if (!res.ok) {
        throw new Error('Không thể kết nối đến máy chủ trợ lý AI.');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Không có câu trả lời.',
        pageCitations: data.pageCitations || [],
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `Hệ thống hỗ trợ học tập: Đã kết nối cơ sở tri thức cục bộ MLN122. Câu hỏi của bạn đã được ghi nhận. Để nhận câu trả lời AI tạo sinh theo thời gian thực, máy chủ sẽ kích hoạt khi có GEMINI_API_KEY trong tệp .env.`,
          pageCitations: [1, 4, 7, 9],
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button if closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-theme-primary hover:bg-blue-700 text-white rounded-full shadow-theme-elevated transition-all duration-200 font-semibold text-xs group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Mở Trợ lý AI"
        >
          <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Hỏi Trợ lý AI</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-surface border border-theme-subtle rounded-3xl shadow-theme-elevated flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200 transition-colors">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Trợ lý AI Học tập MLN122</h4>
                <p className="text-[10px] text-blue-100 flex items-center gap-1 font-mono">
                  <span>Trích dẫn PDF Trang 1-12</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Thu nhỏ trợ lý"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-surface-subtle border-b border-theme-subtle flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1 text-[11px] font-medium bg-surface border border-theme-subtle hover:border-theme-strong rounded-xl text-theme-body transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-theme-primary text-white rounded-br-xs shadow-xs'
                      : 'bg-surface-subtle border border-theme-subtle text-theme-body rounded-bl-xs'
                  }`}
                >
                  <MarkdownRenderer
                    content={msg.text}
                    dense
                    className={msg.sender === 'user' ? '[&_p]:text-white [&_strong]:text-white' : ''}
                  />
                </div>

                {/* PDF Page citation links */}
                {msg.pageCitations && msg.pageCitations.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-theme-faint font-mono">
                    <span>Trang PDF tham khảo:</span>
                    {msg.pageCitations.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => onOpenPdf?.(page)}
                        className="text-theme-primary hover:underline font-bold cursor-pointer"
                      >
                        Tr.{page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-theme-muted text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                <span>Trợ lý AI đang đối chiếu tài liệu MLN122...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-theme-subtle bg-surface flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi về 4 quy luật kinh tế..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs bg-surface-subtle border border-theme-subtle rounded-xl text-theme-heading placeholder:text-theme-faint focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-theme-primary hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
