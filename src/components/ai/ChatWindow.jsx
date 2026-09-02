import React, { useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  RotateCcw, 
  MapPin, 
  CloudSun,
  Bot
} from 'lucide-react';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EmptyChatState } from './EmptyChatState';
import { ChatInput } from './ChatInput';

export const ChatWindow = ({ onClose }) => {
  const {
    messages,
    isThinking,
    activeContext,
    sendMessage,
    clearChat,
    retryLastMessage
  } = useTravelAssistant();

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const destinationName = activeContext?.destination?.name || activeContext?.location?.displayName;

  return (
    <div
      className="flex flex-col h-full w-full bg-white rounded-3xl shadow-float border border-slate-200/90 overflow-hidden"
      role="region"
      aria-labelledby="assistant-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950 text-white border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="assistant-title" className="font-display font-bold text-base text-white leading-tight">
                Vista Holidays Assistant
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                AI Live
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {destinationName ? `Exploring ${destinationName}` : 'Personalized global travel guide'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              title="Clear Conversation"
              aria-label="Clear chat conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close Vista Holidays Assistant dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50"
        tabIndex={0}
        role="log"
        aria-label="Chat messages history"
      >
        {messages.length === 0 ? (
          <EmptyChatState
            activeContext={activeContext}
            onSelectSuggestion={(query) => sendMessage(query)}
          />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRetry={retryLastMessage}
              />
            ))}

            {isThinking && <TypingIndicator />}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0">
        <ChatInput
          onSendMessage={(text) => sendMessage(text)}
          isThinking={isThinking}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
