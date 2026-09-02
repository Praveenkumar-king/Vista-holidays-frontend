import React from 'react';
import { Sparkles, User, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

// Safe inline Markdown parser for basic formatting (bold, italic, code)
function formatInlineText(text = '') {
  // Split on bold, italic, code
  const tokens = [];
  let remaining = text;
  let key = 0;

  // Simple regex for bold (**bold**) and inline code (`code`)
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = remaining.split(pattern);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-brand-700 dark:text-brand-300 font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-inherit">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

// Safe block Markdown parser (headings, lists, paragraphs)
function renderSafeMarkdown(content = '') {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let isNumbered = false;

  const flushList = (key) => {
    if (currentList.length > 0) {
      if (isNumbered) {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 space-y-1 my-2 text-xs sm:text-sm">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {formatInlineText(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-2 text-xs sm:text-sm">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Headings (### or ## or #)
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h4 key={idx} className="font-display font-bold text-sm sm:text-base text-slate-900 mt-3 mb-1">
          {formatInlineText(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="font-display font-extrabold text-base sm:text-lg text-slate-900 mt-4 mb-1.5 border-b border-slate-100 pb-1">
          {formatInlineText(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="font-display font-extrabold text-lg text-slate-900 mt-4 mb-2">
          {formatInlineText(trimmed.replace(/^#\s+/, ''))}
        </h2>
      );
      return;
    }

    // Bullet points (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      isNumbered = false;
      currentList.push(trimmed.replace(/^[-*]\s+/, ''));
      return;
    }

    // Numbered lists (1. 2. etc)
    if (/^\d+\.\s+/.test(trimmed)) {
      isNumbered = true;
      currentList.push(trimmed.replace(/^\d+\.\s+/, ''));
      return;
    }

    // Regular line / paragraph
    flushList(idx);
    if (trimmed) {
      elements.push(
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1.5">
          {formatInlineText(trimmed)}
        </p>
      );
    }
  });

  flushList(lines.length);

  return elements;
}

export const ChatMessage = ({ message, onRetry }) => {
  if (!message) return null;

  const isUser = message.role === 'user';
  const isError = Boolean(message.isError);

  const timeString = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`flex items-start gap-3 w-full animate-fade-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? 'bg-brand-600 text-white'
            : isError
            ? 'bg-amber-500 text-white'
            : 'bg-gradient-to-br from-indigo-600 to-brand-600 text-white'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Message Bubble Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`p-4 rounded-2xl shadow-subtle text-xs sm:text-sm ${
            isUser
              ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-tr-none font-medium'
              : isError
              ? 'bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-none'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="space-y-1">{renderSafeMarkdown(message.content)}</div>
          )}

          {isError && onRetry && (
            <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center gap-2">
              <Button
                variant="secondary"
                size="xs"
                iconLeft={RotateCcw}
                onClick={onRetry}
                className="bg-white text-amber-950 border-amber-300 font-semibold"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timeString && (
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {timeString}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
