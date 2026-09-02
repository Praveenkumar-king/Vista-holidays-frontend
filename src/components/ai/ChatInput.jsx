import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  isThinking = false,
  placeholder = 'Ask a travel question (e.g. "Best places to visit in Paris?")...'
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-focus input when enabled
  useEffect(() => {
    if (!disabled && !isThinking) {
      textareaRef.current?.focus();
    }
  }, [disabled, isThinking]);

  // Adjust textarea height dynamically up to 120px
  const handleInput = (e) => {
    setText(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled || isThinking) return;

    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const charCount = text.length;
  const isOverLimit = charCount > 1000;

  return (
    <form onSubmit={handleSubmit} className="relative w-full border-t border-slate-200/90 bg-white p-3 sm:p-4">
      <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isThinking}
          rows={1}
          maxLength={1000}
          className="flex-grow bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none py-1.5 px-2 max-h-28 overflow-y-auto leading-relaxed"
          aria-label="Ask travel assistant a question"
        />

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="submit"
            disabled={!text.trim() || disabled || isThinking || isOverLimit}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              !text.trim() || disabled || isThinking || isOverLimit
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:scale-105'
            }`}
            aria-label="Send message to travel assistant"
          >
            {isThinking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
        <span>Enter to send · Shift+Enter for new line</span>
        <span className={isOverLimit ? 'text-rose-500 font-bold' : ''}>
          {charCount}/1000
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
