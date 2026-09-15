import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  RotateCcw,
  Trash2,
  MapPin,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  CloudSun,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { Button } from '../../components/ui/Button';

const QUICK_PROMPTS = [
  {
    icon: Calendar,
    title: '3-Day Goa Itinerary',
    prompt: 'Plan a relaxing 3-day beach and cafe itinerary for Goa with family'
  },
  {
    icon: CloudSun,
    title: 'Manali Weather & Packing',
    prompt: 'What is the current weather in Manali and what clothes should I pack?'
  },
  {
    icon: Compass,
    title: 'Budget Jaipur Heritage Tour',
    prompt: 'How can I explore Jaipur forts and local markets within a budget of ₹10,000?'
  },
  {
    icon: MapPin,
    title: 'Offbeat Kerala Locations',
    prompt: 'Recommend 3 offbeat scenic locations in Kerala away from crowded tourist spots'
  }
];

export const UserAiAssistantPage = () => {
  const { currentUser } = useAuth();
  const {
    messages,
    isThinking,
    sendMessage,
    clearChat,
    retryLastMessage,
    error
  } = useTravelAssistant();

  const [inputPrompt, setInputPrompt] = useState('');
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = inputPrompt.trim();
    if (!trimmed || isThinking) return;

    sendMessage(trimmed);
    setInputPrompt('');
  };

  const handlePromptChip = (chipPrompt) => {
    if (isThinking) return;
    sendMessage(chipPrompt);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-slate-50">
      {/* Top Bar / Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-display font-extrabold text-slate-900 tracking-tight">
                Vista Gemini AI Travel Concierge
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Live AI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized vacation planning, itineraries, packing checklists & local advice
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors"
            title="Clear Chat Conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>

      {/* Main Chat Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty State & Prompt Suggestions */
          <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
              <Bot className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                Where to next, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Traveler'}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Ask anything about destinations, budget estimates, cultural etiquette, hidden spots, or request a complete multi-day schedule.
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              {QUICK_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptChip(item.prompt)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group text-left cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-2 text-brand-600">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.prompt}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Chat Message Thread */
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      isUser
                        ? 'bg-brand-600 text-white'
                        : 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white'
                    }`}
                  >
                    {isUser ? (
                      currentUser?.name?.charAt(0).toUpperCase() || 'U'
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white shadow-xs rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1.5 font-mono ${
                        isUser ? 'text-brand-100 text-right' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Streaming Indicator */}
            {isThinking && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 text-amber-300 animate-spin" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-xs p-4 border border-slate-200/80 shadow-xs flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Consulting Gemini AI travel guide...
                  </span>
                </div>
              </div>
            )}

            {/* Error Message with Retry */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-700">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={retryLastMessage}
                  className="flex items-center gap-1 font-bold text-rose-800 hover:underline shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* Chat Input Dock */}
      <div className="bg-white border-t border-slate-200/80 p-4 sm:p-5 shrink-0">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask anything... (e.g., 'What are the top must-visit spots in Udaipur?')"
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Powered by Google Gemini AI • Recommendations should be verified for local seasonal conditions
        </p>
      </div>
    </div>
  );
};

export default UserAiAssistantPage;
