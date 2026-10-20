import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  dense?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  dense = false,
}) => {
  if (!content) return null;

  return (
    <div className={`markdown-content ${dense ? 'text-xs leading-[1.65]' : 'text-xs md:text-sm leading-[1.8]'} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-black text-theme-heading mt-6 mb-3 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-bold text-theme-heading mt-5 mb-2.5 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm md:text-base font-bold text-theme-heading mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs md:text-sm font-semibold text-theme-heading mt-3 mb-1.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-2.5 text-theme-body font-normal leading-[1.8] break-words">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-extrabold text-theme-heading tracking-tight underline decoration-blue-500/30 decoration-2 underline-offset-2">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-theme-heading/90">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-3 space-y-1.5 text-theme-body">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-3 space-y-1.5 text-theme-body">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.75] pl-1 marker:text-blue-500 marker:font-bold">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3.5 pl-4 border-l-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-theme-body py-2 pr-3.5 rounded-r-xl italic shadow-2xs">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded-md text-[11px] font-mono bg-surface-subtle text-theme-primary border border-theme-subtle font-semibold">
                {children}
              </code>
            ) : (
              <pre className="p-3.5 my-3 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto text-[11px] font-mono border border-slate-800">
                <code>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3.5 rounded-xl border border-theme-subtle shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-subtle text-theme-heading font-bold border-b border-theme-subtle">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-theme-subtle bg-surface">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-3 font-bold text-theme-heading whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 text-theme-body align-top">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-primary hover:underline font-semibold"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-5 border-theme-subtle" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
