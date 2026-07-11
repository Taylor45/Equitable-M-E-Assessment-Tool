import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { Question, EquityLevel } from '../types';

function formatFeedback(feedback: string | undefined): React.ReactNode {
  if (!feedback) return null;

  const prefixes = [
    "Conventional/needs improvement",
    "Developing Equity",
    "Highly Equitable/Transformative",
    "Highly Equitable / Transformative"
  ];

  let matchedPrefix = "";
  let remainingText = feedback;

  for (const prefix of prefixes) {
    if (feedback.toLowerCase().startsWith(prefix.toLowerCase())) {
      matchedPrefix = prefix;
      let temp = feedback.substring(prefix.length);
      // Strip leading colon, spaces, newlines
      temp = temp.replace(/^[\s:]+/, '');
      remainingText = temp;
      break;
    }
  }

  if (matchedPrefix) {
    let displayPrefix = matchedPrefix;
    if (matchedPrefix.toLowerCase().includes("highly")) {
      displayPrefix = "Highly Equitable/Transformative";
    } else if (matchedPrefix.toLowerCase().includes("developing")) {
      displayPrefix = "Developing Equity";
    } else if (matchedPrefix.toLowerCase().includes("conventional")) {
      displayPrefix = "Conventional/needs improvement";
    }

    return (
      <span className="whitespace-pre-line">
        <strong className="font-semibold">{displayPrefix}:</strong> {remainingText}
      </span>
    );
  }

  // Fallback: split by first newline or colon
  const firstNewlineIdx = feedback.indexOf('\n');
  const firstColonIdx = feedback.indexOf(':');

  let splitIdx = -1;
  if (firstNewlineIdx !== -1 && firstColonIdx !== -1) {
    splitIdx = Math.min(firstNewlineIdx, firstColonIdx);
  } else {
    splitIdx = firstNewlineIdx !== -1 ? firstNewlineIdx : firstColonIdx;
  }

  if (splitIdx !== -1) {
    const title = feedback.substring(0, splitIdx).trim();
    const rest = feedback.substring(splitIdx + 1).replace(/^[\s:]+/, '').trim();
    if (title && rest) {
      return (
        <span className="whitespace-pre-line">
          <strong className="font-semibold">{title}:</strong> {rest}
        </span>
      );
    }
  }

  return <span className="whitespace-pre-line">{feedback}</span>;
}

interface QuestionCardProps {
  question: Question;
  selectedLevel: EquityLevel | undefined;
  onSelectLevel: (level: EquityLevel) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  totalQuestions: number;
  currentNumber: number;
  dimensionName: string;
  dimensionSubtitle: string;
}

export default function QuestionCard({
  question,
  selectedLevel,
  onSelectLevel,
  onPrevious,
  onNext,
  isFirst,
  totalQuestions,
  currentNumber,
  dimensionName,
  dimensionSubtitle
}: QuestionCardProps) {
  const alphabet = ['A', 'B', 'C'];

  return (
    <div className="bg-white rounded-2xl border border-natural-sand shadow-sm p-6 sm:p-8 relative overflow-hidden">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-natural-olive via-natural-accent to-natural-sand" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold bg-natural-sand/40 text-natural-olive border border-natural-sand px-2 py-1 rounded-md">
            {dimensionName} • {dimensionSubtitle}
          </span>
          <div className="mt-2 text-xs font-semibold text-natural-olive font-mono">
            Section: {question.section}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-xs font-mono text-natural-olive font-bold bg-natural-sand/30 border border-natural-sand rounded px-2.5 py-1">
            Question {currentNumber} of {totalQuestions}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-natural-sand/40 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-natural-olive transition-all duration-300"
          style={{ width: `${(currentNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="font-serif font-light text-natural-ink text-2xl sm:text-3xl md:text-3xl leading-tight">
            {question.text}
          </h2>

          {/* Options List */}
          <div className="space-y-3.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedLevel === opt.level;
              const letter = alphabet[idx];

              let selectionBorder = "border-natural-sand";
              let selectionBg = "bg-white hover:bg-natural-sand/5 hover:border-natural-olive";

              if (isSelected) {
                selectionBorder = "border-natural-olive ring-2 ring-natural-olive/10 shadow-xs";
                selectionBg = "bg-natural-sand/15";
              }

              return (
                <button
                  key={idx}
                  onClick={() => onSelectLevel(opt.level)}
                  className={`w-full text-left p-4 rounded-xl border ${selectionBorder} ${selectionBg} transition-all duration-200 group flex items-start gap-4 cursor-pointer`}
                >
                  {/* Letter Identifier */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-serif font-bold text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-natural-olive text-white border border-natural-olive'
                      : 'bg-white text-natural-ink border border-natural-sand group-hover:bg-natural-sand/10'
                  }`}>
                    {letter}
                  </div>

                  {/* Option Text & Description */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-medium text-natural-ink text-sm sm:text-base">
                        {opt.text}
                      </span>
                    </div>
                    {opt.description && (
                      <p className="text-xs sm:text-sm text-natural-ink/75 leading-relaxed font-light">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Option Feedback Direction Panel */}
          <AnimatePresence mode="wait">
            {selectedLevel && (
              <motion.div
                key={`${question.id}-${selectedLevel}`}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-950 shadow-xs shadow-amber-50 transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Compass size={16} className="text-amber-700" />
                    <span className="font-serif font-bold text-sm sm:text-base tracking-wide">
                      Feedback
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-sans font-light">
                    {formatFeedback(question.options.find(o => o.level === selectedLevel)?.feedback)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-natural-sand/60 pt-6 mt-8">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-serif font-medium text-sm transition-all ${
            isFirst
              ? 'border-natural-sand/40 text-natural-accent/40 cursor-not-allowed'
              : 'border-natural-olive text-natural-olive hover:bg-natural-sand/20 cursor-pointer'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!selectedLevel}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-serif font-bold text-sm transition-all shadow-xs ${
            selectedLevel
              ? 'bg-natural-olive text-white hover:bg-natural-olive/90 hover:shadow-md hover:shadow-natural-olive/10 hover:-translate-y-0.5 cursor-pointer'
              : 'bg-natural-sand/30 text-natural-accent/60 border border-natural-sand/40 cursor-not-allowed'
          }`}
        >
          <span>{currentNumber === totalQuestions ? 'Finish Assessment' : 'Save & Continue'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
