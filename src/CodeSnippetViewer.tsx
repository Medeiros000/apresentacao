import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code } from 'lucide-react';

interface CodeSnippetViewerProps {
  fileName: string;
  tag?: string;
  code: string;
  language?: string;
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  fileName,
  tag = 'TypeScript',
  code,
  language = 'typescript'
}) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
        <span className="flex items-center gap-2 text-indigo-400 font-semibold font-mono">
          <Code size={14} /> {fileName}
        </span>
        <span className="text-[11px] font-mono text-slate-500 uppercase">{tag}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: '#0f172a',
          fontSize: '0.825rem',
          lineHeight: '1.55',
          fontFamily: 'ui-monospace, Consolas, monospace'
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeSnippetViewer;

