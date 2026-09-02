import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

const DEFAULT_SUGGESTIONS = [
  'What are the best places to visit in Paris?',
  'How many days should I spend in Tokyo?',
  'What food should I try in Singapore?',
  'What is the best time to visit Dubai?',
  'Suggest top beaches and cafes in Goa',
  'What should I pack for Manali?'
];

export const SuggestedQuestions = ({
  questions = DEFAULT_SUGGESTIONS,
  onSelectQuestion,
  className = ''
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
        <span>Suggested Travel Questions:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((query, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(query)}
            className="text-left text-xs px-3 py-2 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-900 border border-slate-200/80 hover:border-brand-200 transition-all duration-200 shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            "{query}"
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
