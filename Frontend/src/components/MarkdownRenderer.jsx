import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MarkdownRenderer.css';

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button className="copy-btn" onClick={handleCopy} title="Copy code">
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

export default function MarkdownRenderer({ content }) {
  if (!content) {
    return <p className="md-placeholder">Waiting for response...</p>;
  }

  return (
    <div className="md-body">
      <ReactMarkdown
        components={{
          // Code blocks (fenced ```)
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const language = match ? match[1] : 'text';

            if (!inline && (match || codeString.includes('\n'))) {
              return (
                <div className="code-block-wrapper">
                  <div className="code-block-header">
                    <div className="code-lang-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      <span>{language}</span>
                    </div>
                    <CopyButton code={codeString} />
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    showLineNumbers={codeString.split('\n').length > 4}
                    wrapLines={true}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 8px 8px',
                      background: 'rgba(1, 10, 20, 0.85)',
                      fontSize: '0.82rem',
                      lineHeight: '1.6',
                      padding: '1rem 1.25rem',
                    }}
                    lineNumberStyle={{
                      color: 'rgba(100,120,140,0.5)',
                      minWidth: '2rem',
                      marginRight: '1rem',
                      userSelect: 'none',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Inline code
            return (
              <code className="md-inline-code" {...props}>
                {children}
              </code>
            );
          },

          // Headings
          h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="md-h3">{children}</h3>,

          // Paragraphs
          p: ({ children }) => <p className="md-p">{children}</p>,

          // Lists
          ul: ({ children }) => <ul className="md-ul">{children}</ul>,
          ol: ({ children }) => <ol className="md-ol">{children}</ol>,
          li: ({ children }) => <li className="md-li">{children}</li>,

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="md-blockquote">{children}</blockquote>
          ),

          // Strong / Em
          strong: ({ children }) => <strong className="md-strong">{children}</strong>,
          em: ({ children }) => <em className="md-em">{children}</em>,

          // Horizontal rule
          hr: () => <hr className="md-hr" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
