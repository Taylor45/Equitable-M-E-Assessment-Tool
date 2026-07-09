import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award, Compass, Users, BarChart3, TrendingUp } from 'lucide-react';
import { Dimension, EquityLevel } from '../types';

interface DimensionFeedbackProps {
  dimension: Dimension;
  l1Count: number;
  l2Count: number;
  l3Count: number;
  onContinue: () => void;
  isLastDimension: boolean;
}

export default function DimensionFeedback({
  dimension,
  l1Count,
  l2Count,
  l3Count,
  onContinue,
  isLastDimension
}: DimensionFeedbackProps) {
  // Determine dominant level
  const maxVal = Math.max(l1Count, l2Count, l3Count);
  const isTie = (l1Count === maxVal ? 1 : 0) + (l2Count === maxVal ? 1 : 0) + (l3Count === maxVal ? 1 : 0) > 1;

  let dominantLevel: 'L1' | 'L2' | 'L3' | 'TIE' = 'L1';
  if (isTie) {
    dominantLevel = 'TIE';
  } else if (l1Count === maxVal) {
    dominantLevel = 'L1';
  } else if (l2Count === maxVal) {
    dominantLevel = 'L2';
  } else if (l3Count === maxVal) {
    dominantLevel = 'L3';
  }

  // Set visual properties based on level
  const levelStyles = {
    L1: {
      badge: "Conventional Practice",
      desc: "Primarily compliance-driven or standard Western approaches.",
      color: "border-natural-sand bg-natural-sand/10 text-natural-ink",
      pill: "bg-natural-sand/40 text-natural-ink",
      feedbackText: dimension.feedback.L1
    },
    L2: {
      badge: "Developing Equity",
      desc: "Intentional efforts to integrate equity and consult community.",
      color: "border-natural-sand bg-natural-sand/20 text-natural-ink",
      pill: "bg-natural-accent/30 text-natural-olive",
      feedbackText: dimension.feedback.L2
    },
    L3: {
      badge: "Highly Transformative",
      desc: "Decolonial, justice-centred, and community-led practices.",
      color: "border-natural-olive bg-natural-sand/30 text-natural-ink",
      pill: "bg-natural-olive text-white",
      feedbackText: dimension.feedback.L3
    },
    TIE: {
      badge: "Mixed / Balanced Practice",
      desc: "Varying degrees of conventional and equitable practices.",
      color: "border-natural-sand bg-natural-sand/15 text-natural-ink",
      pill: "bg-natural-sand/80 text-natural-olive",
      feedbackText: dimension.feedback.tie || "Your profile is highly balanced with active shifts across multiple approaches."
    }
  };

  const style = levelStyles[dominantLevel];

  // Get corresponding icon for the dimension
  const getDimensionIcon = () => {
    switch (dimension.id) {
      case 1: return <Compass className="w-8 h-8 text-natural-olive" />;
      case 2: return <Users className="w-8 h-8 text-natural-olive" />;
      case 3: return <BarChart3 className="w-8 h-8 text-natural-olive" />;
      case 4: return <TrendingUp className="w-8 h-8 text-natural-olive" />;
      default: return <Award className="w-8 h-8 text-natural-ink/70" />;
    }
  };

  const totalVotes = l1Count + l2Count + l3Count;
  const getPercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-natural-sand shadow-sm p-6 sm:p-8 max-w-3xl mx-auto"
    >
      {/* Sparkles Decoration */}
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-2xl bg-natural-sand/20 border border-natural-sand relative">
          {getDimensionIcon()}
          <span className="absolute -top-1 -right-1 bg-natural-olive text-white rounded-full p-1 animate-pulse">
            <Sparkles size={10} />
          </span>
        </div>
      </div>

      <div className="text-center space-y-2 mb-8">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-natural-accent">
          Reflection Completed
        </h3>
        <h2 className="font-serif font-semibold text-natural-olive text-2xl sm:text-3xl leading-tight">
          {dimension.name}
        </h2>
        <p className="text-xs sm:text-sm text-natural-ink/70 font-medium">
          {dimension.subtitle}
        </p>
      </div>

      {/* Score / Counter Chart */}
      <div className="bg-natural-sand/10 border border-natural-sand/70 rounded-2xl p-5 mb-8">
        <h4 className="font-serif font-bold text-natural-olive text-xs sm:text-sm mb-4 text-center sm:text-left">
          Your practice distribution in this dimension:
        </h4>

        <div className="space-y-4">
          {/* L1 Level Row */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-natural-ink/80">L1 - Conventional Practices</span>
              <span className="font-mono text-natural-ink/60 font-bold">{l1Count} ({getPercentage(l1Count)}%)</span>
            </div>
            <div className="w-full h-2.5 bg-natural-sand/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-natural-accent/50 rounded-full transition-all duration-500"
                style={{ width: `${getPercentage(l1Count)}%` }}
              />
            </div>
          </div>

          {/* L2 Level Row */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-natural-ink/80">L2 - Developing Equity</span>
              <span className="font-mono text-natural-ink/60 font-bold">{l2Count} ({getPercentage(l2Count)}%)</span>
            </div>
            <div className="w-full h-2.5 bg-natural-sand/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-natural-accent rounded-full transition-all duration-500"
                style={{ width: `${getPercentage(l2Count)}%` }}
              />
            </div>
          </div>

          {/* L3 Level Row */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-natural-ink/80">L3 - Transformative Practice</span>
              <span className="font-mono text-natural-ink/60 font-bold">{l3Count} ({getPercentage(l3Count)}%)</span>
            </div>
            <div className="w-full h-2.5 bg-natural-sand/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-natural-olive rounded-full transition-all duration-500"
                style={{ width: `${getPercentage(l3Count)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dominant Feedback Box */}
      <div className={`border rounded-2xl p-6 sm:p-7 shadow-xs ${style.color} space-y-3.5 mb-8`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-1 rounded-md ${style.pill}`}>
              {style.badge}
            </span>
            <p className="text-[11px] text-natural-ink/70 font-medium mt-1.5">{style.desc}</p>
          </div>
        </div>

        <div className="border-t border-natural-sand/40 my-3" />

        <p className="text-natural-ink/90 text-xs sm:text-sm leading-relaxed font-light">
          {style.feedbackText}
        </p>
      </div>

      {/* Navigation button */}
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-natural-olive hover:bg-natural-olive/90 text-white font-serif font-bold text-sm sm:text-base rounded-full shadow-xs hover:shadow-md hover:shadow-natural-olive/10 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <span>{isLastDimension ? "Proceed to Final Profile Dashboard" : "Continue to Next Dimension"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
