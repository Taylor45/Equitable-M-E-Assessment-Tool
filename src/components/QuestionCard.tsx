import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Question, EquityLevel } from '../types';

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
  // We can add a simple toggle state to show L1/L2/L3 values for training/testing purposes
  const [showLevels, setShowLevels] = React.useState(false);

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
          <button
            onClick={() => setShowLevels(!showLevels)}
            className="flex items-center gap-1 text-[11px] font-medium text-natural-olive hover:bg-natural-sand/30 transition-colors bg-natural-sand/20 border border-natural-sand rounded px-2 py-1 cursor-pointer"
            title="Toggle viewing of L1/L2/L3 levels"
          >
            {showLevels ? <EyeOff size={12} /> : <Eye size={12} />}
            <span>{showLevels ? 'Hide Levels' : 'Study Mode (Show Levels)'}</span>
          </button>
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

              // Set distinct styles based on level if study mode is enabled
              let studyBadgeColor = "bg-natural-sand/40 text-natural-ink/70 border border-natural-sand";
              let selectionBorder = "border-natural-sand";
              let selectionBg = "bg-white hover:bg-natural-sand/5 hover:border-natural-olive";

              if (showLevels) {
                if (opt.level === 'L3') studyBadgeColor = "bg-natural-sand/50 text-natural-olive border border-natural-sand";
                if (opt.level === 'L2') studyBadgeColor = "bg-natural-accent/20 text-natural-olive border border-natural-sand/60";
                if (opt.level === 'L1') studyBadgeColor = "bg-amber-100/60 text-amber-900 border border-amber-200";
              }

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
                      {showLevels && (
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${studyBadgeColor}`}>
                          {opt.level}
                        </span>
                      )}
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
