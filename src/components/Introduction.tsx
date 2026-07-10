import React from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Users, BarChart3, TrendingUp, Compass, ArrowRight, HelpCircle } from 'lucide-react';

interface IntroductionProps {
  onStart: () => void;
}

const dimensionsInfo = [
  {
    icon: Compass,
    title: "Planning & Design",
    subtitle: "Foundational Equity",
    desc: "Assesses the philosophical basis and conceptual design of your M&E system, grounding it in appropriate epistemologies.",
    color: "from-natural-sand/20 to-natural-sand/10 text-natural-olive border-natural-sand/80"
  },
  {
    icon: Users,
    title: "Implementation",
    subtitle: "Power and Participation",
    desc: "Assesses who is involved, how decisions are made, resource control, and community compensation structures.",
    color: "from-natural-accent/15 to-natural-accent/5 text-natural-olive border-natural-sand/80"
  },
  {
    icon: BarChart3,
    title: "Data Analysis & Interpretation",
    subtitle: "Cultural Competence",
    desc: "Focuses on how data is translated into meaning and respected.",
    color: "from-natural-olive/10 to-natural-olive/5 text-natural-olive border-natural-sand/80"
  },
  {
    icon: TrendingUp,
    title: "Use of Findings & Accountability",
    subtitle: "Systemic Change",
    desc: "Focuses on the commitment to systemic change.",
    color: "from-natural-sand/30 to-natural-sand/20 text-natural-olive border-natural-sand/90"
  }
];

export default function Introduction({ onStart }: IntroductionProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-natural-sand/40 text-natural-olive border border-natural-sand/90 text-xs font-semibold uppercase tracking-wider mb-4"
        >
          <ClipboardCheck size={14} className="animate-pulse" />
          <span>Self-Assessment & Reflection</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-serif text-4xl sm:text-5xl font-semibold text-natural-olive tracking-tight mb-4"
        >
          Welcome to the Equitable M&E Reflection Tool
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg text-natural-ink/95 max-w-3xl mx-auto leading-relaxed mb-4"
        >
          This tool is designed to help you reflect on how equity is embedded within your Monitoring and Evaluation (M&E) practices.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-base text-natural-ink/85 max-w-3xl mx-auto leading-relaxed"
        >
          Rather than assessing what is “right” or “wrong”, this experience invites you to consider how your current approaches align with different levels of equity-oriented practice — from conventional approaches to more transformative practices.
        </motion.p>
      </div>

      <div className="mb-6 text-center">
        <h3 className="font-serif font-bold text-natural-olive text-lg mb-2">You will be guided through four key areas:</h3>
      </div>

      {/* Guide Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10"
      >
        {dimensionsInfo.map((dim, idx) => {
          const Icon = dim.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${dim.color} shadow-xs hover:shadow-sm transition-shadow duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-white border border-natural-sand shadow-xs">
                    <Icon size={20} className="stroke-[2px]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-natural-ink text-base">{dim.title}</h3>
                    <p className="text-[11px] font-mono uppercase font-semibold text-natural-accent tracking-wider">
                      {dim.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-natural-ink/80 leading-relaxed mb-4">{dim.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Invitation Callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white border border-natural-sand rounded-2xl p-6 mb-10 flex flex-col sm:flex-row gap-5 items-start"
      >
        <div className="p-3 rounded-full bg-natural-sand/40 text-natural-olive border border-natural-sand/80 flex-shrink-0">
          <HelpCircle size={22} />
        </div>
        <div>
          <h4 className="font-serif font-bold text-natural-olive mb-1.5 text-sm sm:text-base">Important Guidance</h4>
          <ul className="text-xs text-natural-ink/80 space-y-2 list-disc list-inside">
            <li>For each question, select the option that most closely reflects your current practice.</li>
            <li>Be as honest as possible — this is a reflective tool, not an evaluation.</li>
            <li>At the end, you will receive a profile that highlights where your practices currently sit and where there may be opportunities to deepen equity.</li>
            <li className="font-semibold text-natural-ink list-none mt-2 text-sm text-natural-olive">There are no correct answers — only opportunities for reflection and growth.</li>
          </ul>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-natural-olive text-white rounded-full font-serif font-bold text-base hover:bg-natural-olive/90 transition-all shadow-md hover:shadow-natural-olive/10 hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Begin Self-Assessment</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
