/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck } from 'lucide-react';

import { questions, dimensions } from './questions';
import { EquityLevel, Question, Dimension } from './types';

// SCORM Integration
import {
  initSCORM,
  getSavedAnswersFromSCORM,
  saveAnswersToSCORM,
  reportCompletion,
  isSCORMActive,
  getSCORMVersion,
  terminateSCORM
} from './lib/scorm';

// Components
import Introduction from './components/Introduction';
import QuestionCard from './components/QuestionCard';
import DimensionFeedback from './components/DimensionFeedback';
import FinalDashboard from './components/FinalDashboard';

export default function App() {
  // State
  const [step, setStep] = useState<'intro' | 'question' | 'dimension-feedback' | 'final'>('intro');
  const [answers, setAnswers] = useState<Record<number, EquityLevel>>(() => {
    const saved = localStorage.getItem('me_assessment_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [activeDimensionFeedbackId, setActiveDimensionFeedbackId] = useState<number | null>(null);
  const [isLMS, setIsLMS] = useState<boolean>(false);
  const [scormVer, setScormVer] = useState<'1.2' | '2004' | null>(null);

  // Initialize SCORM on Mount
  useEffect(() => {
    const hasSCORM = initSCORM();
    if (hasSCORM) {
      setIsLMS(true);
      setScormVer(getSCORMVersion());
      const savedAnswers = getSavedAnswersFromSCORM();
      if (savedAnswers && Object.keys(savedAnswers).length > 0) {
        setAnswers(savedAnswers as Record<number, EquityLevel>);
        
        // Find current progress
        const answeredIds = Object.keys(savedAnswers).map(Number);
        const maxAnswered = Math.max(...answeredIds);
        const nextQ = Math.min(maxAnswered + 1, questions.length);
        
        if (answeredIds.length === questions.length) {
          setStep('final');
        } else {
          setCurrentQuestionId(nextQ);
          setStep('question');
        }
      }
    }

    return () => {
      terminateSCORM();
    };
  }, []);

  // Sync state to local storage and SCORM
  useEffect(() => {
    localStorage.setItem('me_assessment_answers', JSON.stringify(answers));
    if (isSCORMActive()) {
      saveAnswersToSCORM(answers);
    }
  }, [answers]);

  // Handle Level Selection
  const handleSelectLevel = (level: EquityLevel) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionId]: level
    }));
  };

  // Previous Question
  const handlePrevious = () => {
    if (currentQuestionId > 1) {
      const prevId = currentQuestionId - 1;
      const currentQ = questions.find(q => q.id === currentQuestionId);
      const prevQ = questions.find(q => q.id === prevId);

      // If going backwards crosses a dimension boundary, we can still just go back cleanly
      setCurrentQuestionId(prevId);
    }
  };

  // Next Question / Finish / Dimension Boundary
  const handleNext = () => {
    const currentQ = questions.find(q => q.id === currentQuestionId);
    if (!currentQ) return;

    const currentDim = dimensions.find(d => d.id === currentQ.dimensionId);
    if (!currentDim) return;

    // Check if this question is the LAST question in the current dimension
    const lastQuestionInDimId = currentDim.questionIds[currentDim.questionIds.length - 1];

    if (currentQuestionId === lastQuestionInDimId) {
      // Trigger Dimension Feedback
      setActiveDimensionFeedbackId(currentDim.id);
      setStep('dimension-feedback');
    } else {
      // Go to next question
      setCurrentQuestionId(prev => prev + 1);
    }
  };

  // Continue from Dimension Feedback Screen
  const handleContinueFromFeedback = () => {
    if (activeDimensionFeedbackId === null) return;

    if (activeDimensionFeedbackId === 4) {
      // It was the last dimension, go to final dashboard!
      setStep('final');
      setActiveDimensionFeedbackId(null);

      // Report SCORM Completion
      if (isSCORMActive()) {
        let totalL1 = 0;
        let totalL2 = 0;
        let totalL3 = 0;
        questions.forEach(q => {
          const val = answers[q.id];
          if (val === 'L1') totalL1++;
          else if (val === 'L2') totalL2++;
          else if (val === 'L3') totalL3++;
        });
        const answeredCount = totalL1 + totalL2 + totalL3;
        const averageScore = answeredCount > 0 ? (totalL1 * 1 + totalL2 * 2 + totalL3 * 3) / answeredCount : 1.0;
        const scorePercent = ((averageScore - 1.0) / 2.0) * 100;
        reportCompletion(scorePercent);
      }
    } else {
      // Proceed to the first question of the next dimension
      const nextDimId = activeDimensionFeedbackId + 1;
      const nextDim = dimensions.find(d => d.id === nextDimId);
      if (nextDim && nextDim.questionIds.length > 0) {
        setCurrentQuestionId(nextDim.questionIds[0]);
        setStep('question');
        setActiveDimensionFeedbackId(null);
      }
    }
  };

  // Reset / Clear
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all variables and restart the self-assessment? This will clear your current progress.")) {
      setAnswers({});
      setCurrentQuestionId(1);
      setActiveDimensionFeedbackId(null);
      setStep('intro');
      localStorage.removeItem('me_assessment_answers');
      localStorage.removeItem('me_assessment_action_notes');
      localStorage.removeItem('me_assessment_completed_actions');
    }
  };

  // Fast Jump to a specific question (only for developer/study purposes)
  const handleJumpToQuestion = (qId: number) => {
    setCurrentQuestionId(qId);
    setStep('question');
  };

  // Get active question details
  const activeQuestion = questions.find(q => q.id === currentQuestionId) || questions[0];
  const activeDimension = dimensions.find(d => d.id === activeQuestion.dimensionId) || dimensions[0];

  // Helper to count selected levels for active feedback
  const getCountsForDimension = (dimId: number) => {
    const dim = dimensions.find(d => d.id === dimId);
    if (!dim) return { L1: 0, L2: 0, L3: 0 };

    let L1 = 0;
    let L2 = 0;
    let L3 = 0;

    dim.questionIds.forEach(qId => {
      const ans = answers[qId];
      if (ans === 'L1') L1++;
      if (ans === 'L2') L2++;
      if (ans === 'L3') L3++;
    });

    return { L1, L2, L3 };
  };

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col justify-between pb-12">
      
      {/* Sleek App Header */}
      <header className="bg-white border-b border-natural-sand/70 py-4 px-6 sticky top-0 z-30 shadow-xs no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-natural-olive text-white rounded-xl shadow-md shadow-natural-olive/20">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-natural-olive text-base sm:text-lg tracking-tight">
                Equitable M&E Reflection Tool
              </h1>
              <p className="text-[10px] text-natural-accent font-mono font-medium">Status: Connected to Runtime Variables</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Action buttons or info can go here */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Introduction onStart={() => {
                setStep('question');
                setCurrentQuestionId(1);
              }} />
            </motion.div>
          )}

          {step === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto w-full"
            >
              <QuestionCard
                question={activeQuestion}
                selectedLevel={answers[currentQuestionId]}
                onSelectLevel={handleSelectLevel}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isFirst={currentQuestionId === 1}
                totalQuestions={questions.length}
                currentNumber={currentQuestionId}
                dimensionName={activeDimension.name}
                dimensionSubtitle={activeDimension.subtitle}
              />
            </motion.div>
          )}

          {step === 'dimension-feedback' && activeDimensionFeedbackId !== null && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {(() => {
                const { L1, L2, L3 } = getCountsForDimension(activeDimensionFeedbackId);
                const activeDim = dimensions.find(d => d.id === activeDimensionFeedbackId)!;
                return (
                  <DimensionFeedback
                    dimension={activeDim}
                    l1Count={L1}
                    l2Count={L2}
                    l3Count={L3}
                    onContinue={handleContinueFromFeedback}
                    isLastDimension={activeDimensionFeedbackId === 4}
                  />
                );
              })()}
            </motion.div>
          )}

          {step === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <FinalDashboard
                answers={answers}
                onReset={handleReset}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
