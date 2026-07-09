import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Award, Sparkles, Printer, RotateCcw, ChevronRight, ChevronDown, CheckSquare,
  Square, FileText, ClipboardList, AlertCircle, Compass, Users, BarChart3,
  TrendingUp, ArrowUpRight, HelpCircle, Save, CheckCircle
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { questions, dimensions } from '../questions';
import { EquityLevel, Dimension } from '../types';

interface FinalDashboardProps {
  answers: Record<number, EquityLevel>;
  onReset: () => void;
}

export default function FinalDashboard({ answers, onReset }: FinalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'breakdown' | 'planner'>('profile');
  const [expandedDimension, setExpandedDimension] = useState<number | null>(1);
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  // Custom User Action Notes
  const [actionNotes, setActionNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('me_assessment_action_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('me_assessment_completed_actions');
    return saved ? JSON.parse(saved) : {};
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate Dimension Counts
  const dimensionCounts = useMemo(() => {
    const counts: Record<number, { L1: number; L2: number; L3: number; total: number; avgScore: number }> = {};

    dimensions.forEach(d => {
      counts[d.id] = { L1: 0, L2: 0, L3: 0, total: 0, avgScore: 0 };
    });

    Object.entries(answers).forEach(([qIdStr, level]) => {
      const qId = parseInt(qIdStr);
      const q = questions.find(q => q.id === qId);
      if (!q) return;

      const dId = q.dimensionId;
      counts[dId][level]++;
      counts[dId].total++;
    });

    dimensions.forEach(d => {
      const c = counts[d.id];
      if (c.total > 0) {
        c.avgScore = parseFloat(((c.L1 * 1 + c.L2 * 2 + c.L3 * 3) / c.total).toFixed(2));
      }
    });

    return counts;
  }, [answers]);

  // Overall Counts
  const overallCounts = useMemo(() => {
    let L1 = 0;
    let L2 = 0;
    let L3 = 0;
    let total = 0;

    (Object.values(dimensionCounts) as Array<{ L1: number; L2: number; L3: number; total: number; avgScore: number }>).forEach(c => {
      L1 += c.L1;
      L2 += c.L2;
      L3 += c.L3;
      total += c.total;
    });

    const avgScore = total > 0 ? parseFloat(((L1 * 1 + L2 * 2 + L3 * 3) / total).toFixed(2)) : 0;

    return { L1, L2, L3, total, avgScore };
  }, [dimensionCounts]);

  // Determine Overall Profile Level
  const overallProfile = useMemo(() => {
    const { L1, L2, L3 } = overallCounts;
    const maxVal = Math.max(L1, L2, L3);

    const isTie = (L1 === maxVal ? 1 : 0) + (L2 === maxVal ? 1 : 0) + (L3 === maxVal ? 1 : 0) > 1;

    if (isTie) {
      return {
        id: 'TIE',
        title: "Mixed Equity Practitioner Profile",
        tag: "Balanced Model",
        color: "from-natural-accent to-natural-olive text-natural-olive bg-natural-sand/20 border-natural-sand",
        pills: "bg-natural-sand text-natural-ink font-semibold",
        summary: "Your M&E practices reflect a highly balanced, transitioning approach. You have adopted progressive, participatory methods in some areas, while retaining conventional, donor-driven or Western-centric models in others. This transitional profile is common as organizations begin to operationalize decolonial and equity-centered evaluation values, showing rich potential for deeper, systematic integration."
      };
    } else if (L3 === maxVal) {
      return {
        id: 'L3',
        title: "Transformative Equity Leader",
        tag: "Transformative (L3)",
        color: "from-natural-olive to-natural-olive/90 text-natural-olive bg-natural-sand/30 border-natural-sand",
        pills: "bg-natural-olive text-white font-medium",
        summary: "Your organization demonstrates highly progressive, transformative M&E practices. You actively challenge dominant, Westernized evaluation paradigms, centering local and indigenous knowledge. Communities hold genuine power as co-creators in your design, implementation, and analysis. Data is culturally validated, shared transparently, and used boldly to lobby for structural change and challenge systemic inequities."
      };
    } else if (L2 === maxVal) {
      return {
        id: 'L2',
        title: "Developing Equity Practitioner",
        tag: "Developing (L2)",
        color: "from-natural-accent to-natural-accent/90 text-natural-olive bg-natural-sand/20 border-natural-sand",
        pills: "bg-natural-accent/35 text-natural-olive font-medium",
        summary: "You have taken active, intentional steps to integrate equity considerations into your M&E system. You routinely consult communities, use qualitative methodologies, and track basic demographic categories (like gender and age). However, major decision-making power, M&E resource control, and data validation remain centralized within professional teams or donor requirements. Transitioning from basic consultation to structural co-ownership is your key area of growth."
      };
    } else {
      return {
        id: 'L1',
        title: "Conventional Foundation Practising",
        tag: "Conventional (L1)",
        color: "from-natural-sand to-natural-sand/80 text-natural-ink bg-natural-sand/10 border-natural-sand",
        pills: "bg-natural-sand/50 text-natural-ink font-medium",
        summary: "Your current M&E framework represents conventional, standard evaluation practices. Decisions and metrics are heavily dominated by traditional compliance frameworks, focusing narrowly on project efficiency, outputs, and donor specifications. Community stakeholders act primarily as passive sources of data rather than collaborators. This conventional baseline serves as an important starting point to identify specific opportunities to embed equity."
      };
    }
  }, [overallCounts]);

  // Recharts Data Prep
  const chartData = useMemo(() => {
    return dimensions.map(d => {
      const count = dimensionCounts[d.id];
      return {
        subject: d.name,
        Maturity: count.avgScore,
        L1_Count: count.L1,
        L2_Count: count.L2,
        L3_Count: count.L3,
        fullMark: 3.0
      };
    });
  }, [dimensionCounts]);

  // Actions / Recommendations Creator
  const actionableRecommendations = useMemo(() => {
    const list: Array<{
      questionId: number;
      text: string;
      dimensionName: string;
      levelSelected: EquityLevel;
      action: string;
    }> = [];

    Object.entries(answers).forEach(([qIdStr, level]) => {
      const qId = parseInt(qIdStr);
      if (level === 'L3') return; // L3 doesn't need basic recommendations

      const q = questions.find(q => q.id === qId);
      if (!q) return;

      const dim = dimensions.find(d => d.id === q.dimensionId);
      if (!dim) return;

      let actionText = "";

      // Generate customized action items based on question text and answers
      if (q.id === 1 || q.id === 2 || q.id === 3) {
        actionText = "Revise your organization's core M&E theory of change to explicitly ground it in decolonial or culturally responsive evaluation paradigms (e.g., Afrocentric evaluation).";
      } else if (q.id === 4 || q.id === 5 || q.id === 7) {
        actionText = "Reframe your conceptual framework to address structural inequalities rather than simple equal representation. Establish benchmarks directly measuring shifts in community decision-making control.";
      } else if (q.id === 6) {
        actionText = "Establish a systematic protocol to consistently disaggregate all collected quantitative data across multiple intersectional layers, including disability, gender, age, geography, and socio-economic status.";
      } else if (q.id === 8 || q.id === 9) {
        actionText = "Rephrase core evaluation questions to focus on critical inquiry and power analysis (e.g., 'Whose needs are served, whose are ignored, and why?'). Move beyond purely Counting inputs and outputs.";
      } else if (q.id === 10 || q.id === 11) {
        actionText = "Transition community engagement from mere 'consultation' or 'data sources' into active co-creators. Create a participatory panel that co-designs indicators, methods, and schedules.";
      } else if (q.id === 12) {
        actionText = "Adopt a formal policy to consistently compensate community members for their labor, knowledge, and time spent participating in focus groups or as co-evaluators, aligning with professional or equitable standards.";
      } else if (q.id === 13 || q.id === 14) {
        actionText = "Pilot localized, narrative-based methodologies (such as community storytelling or talanoa) that are culturally appropriate, reducing reliance on dense standardized surveys.";
      } else if (q.id === 15) {
        actionText = "Ring-fence a dedicated portion of the evaluation budget to be owned and spent under direct community guidance, empowering them to pursue local learning priorities.";
      } else if (q.id === 16 || q.id === 17 || q.id === 18 || q.id === 19) {
        actionText = "Incorporate mandatory participatory data validation workshops, where community members interpret raw findings and co-author the main analytical conclusions before finalizing the report.";
      } else if (q.id === 20 || q.id === 21) {
        actionText = "Establish formal, pre-M&E data sharing agreements (e.g., following OCAP principles) granting communities full accessibility to their raw data, with veto power over external publishing.";
      } else if (q.id === 22 || q.id === 23) {
        actionText = "Invest in multilingual, multi-format dissemination campaigns (using local radio, infographics, oral storytelling sessions) to ensure M&E findings are accessible to all literacy levels.";
      } else if (q.id === 24 || q.id === 25 || q.id === 26) {
        actionText = "Demonstrate institutional courage by publicizing uncomfortable or negative M&E findings. Run collaborative 'post-mortems' to adjust programmatic budgets and strategies accordingly.";
      } else if (q.id === 27 || q.id === 28 || q.id === 29) {
        actionText = "Actively partner with policy advocates or sector networks to translate evaluation data into policy briefings, lobbying for structural and funding reforms.";
      } else if (q.id === 30) {
        actionText = "Create recurring internal reflection circles and cross-department spaces to integrate M&E findings directly into ongoing operational and design decisions.";
      }

      if (actionText) {
        list.push({
          questionId: q.id,
          text: q.text,
          dimensionName: dim.name,
          levelSelected: level,
          action: actionText
        });
      }
    });

    return list;
  }, [answers]);

  // Save actions handler
  const saveActionPlan = () => {
    localStorage.setItem('me_assessment_action_notes', JSON.stringify(actionNotes));
    localStorage.setItem('me_assessment_completed_actions', JSON.stringify(completedActions));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleNoteChange = (qId: number, text: string) => {
    setActionNotes(prev => ({ ...prev, [qId]: text }));
  };

  const toggleActionCompleted = (qId: number) => {
    setCompletedActions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0 print:space-y-4 max-w-5xl mx-auto">
      {/* Action / Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print border-b border-natural-sand/70 pb-5">
        <div>
          <h2 className="font-serif font-bold text-natural-olive text-2xl sm:text-3xl tracking-tight">
            Your Equitable M&E Profile
          </h2>
          <p className="text-xs sm:text-sm text-natural-ink/70 font-medium">
            Maturity Index Score: <span className="font-mono text-natural-olive font-bold">{overallCounts.avgScore}</span> / 3.0
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-natural-olive text-natural-olive hover:bg-natural-sand/25 font-serif font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Export Report / Print</span>
          </button>

          <a
            href="/scorm-package.zip"
            download="equitable-me-scorm.zip"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-natural-olive text-white hover:bg-natural-olive/90 font-serif font-bold text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer text-center"
            title="Download SCORM 1.2 Package (.zip) for uploading to standard LMS"
          >
            <Save size={15} />
            <span>Download SCORM ZIP</span>
          </a>

          <button
            onClick={onReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-natural-sand/30 hover:bg-natural-sand/50 text-natural-ink border border-natural-sand font-serif font-semibold text-xs sm:text-sm rounded-full shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block border-b border-natural-sand pb-4 mb-6">
        <h1 className="font-serif text-3xl font-bold text-natural-olive">
          Equitable M&E Assessment Report
        </h1>
        <p className="text-sm text-natural-ink/75 font-mono mt-1">
          Date Completed: {new Date().toLocaleDateString()} | Overall Score: {overallCounts.avgScore} / 3.0
        </p>
      </div>

      {/* Tab Navigation (No-Print) */}
      <div className="flex border-b border-natural-sand gap-1 no-print">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-serif font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-natural-olive text-natural-olive'
              : 'border-transparent text-natural-accent hover:text-natural-olive'
          }`}
        >
          <div className="flex items-center gap-2">
            <Award size={15} />
            <span>Overall Profile</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-4 py-3 font-serif font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'breakdown'
              ? 'border-natural-olive text-natural-olive'
              : 'border-transparent text-natural-accent hover:text-natural-olive'
          }`}
        >
          <div className="flex items-center gap-2">
            <ClipboardList size={15} />
            <span>Dimension Deep-Dive</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className={`px-4 py-3 font-serif font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'planner'
              ? 'border-natural-olive text-natural-olive'
              : 'border-transparent text-natural-accent hover:text-natural-olive'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={15} />
            <span>Action Planner ({actionableRecommendations.length})</span>
          </div>
        </button>
      </div>

      {/* --- TAB CONTENT: PROFILE & OVERVIEW --- */}
      {/* --- TAB CONTENT: PROFILE & OVERVIEW --- */}
      <div className={`${activeTab === 'profile' ? 'block' : 'hidden'} print:block space-y-8 print:space-y-4`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Overall Score Badge & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-natural-sand shadow-sm overflow-hidden print:shadow-none">
              <div className="bg-gradient-to-r from-natural-olive to-natural-olive/95 p-6 sm:p-8 text-white relative">
                <div className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white no-print">
                  <Award size={28} className="animate-pulse" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-natural-accent">
                  Self-Assessment Final Verdict
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-2.5 text-white">
                  {overallProfile.title}
                </h3>
                <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-white/15 rounded-md text-xs font-semibold font-mono text-white">
                  <span>Maturity Code: {overallProfile.tag}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-natural-ink/90 leading-relaxed text-sm sm:text-base font-light">
                  {overallProfile.summary}
                </p>

                {/* Summary grid */}
                <div className="grid grid-cols-3 gap-4 border-t border-natural-sand/60 pt-6">
                  <div className="text-center p-3 bg-natural-sand/30 rounded-2xl border border-natural-sand">
                    <div className="text-base sm:text-lg font-mono font-bold text-natural-ink">{overallCounts.L1}</div>
                    <div className="text-[10px] text-natural-ink/70 font-medium mt-0.5">L1 Practices</div>
                  </div>
                  <div className="text-center p-3 bg-natural-accent/25 rounded-2xl border border-natural-sand">
                    <div className="text-base sm:text-lg font-mono font-bold text-natural-olive">{overallCounts.L2}</div>
                    <div className="text-[10px] text-natural-olive/80 font-medium mt-0.5">L2 Practices</div>
                  </div>
                  <div className="text-center p-3 bg-natural-sand/20 rounded-2xl border border-natural-olive">
                    <div className="text-base sm:text-lg font-mono font-bold text-natural-olive">{overallCounts.L3}</div>
                    <div className="text-[10px] text-natural-olive font-medium mt-0.5">L3 Practices</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension Quick Index List */}
            <div className="bg-white rounded-2xl border border-natural-sand shadow-sm p-6 space-y-4 print-break-inside-avoid print:shadow-none">
              <h4 className="font-serif font-bold text-natural-olive text-sm sm:text-base">
                Dimension Practice Indices
              </h4>
              <div className="space-y-3">
                {dimensions.map(dim => {
                  const count = dimensionCounts[dim.id];
                  let indicatorColor = "bg-natural-sand";
                  if (count.avgScore >= 2.5) indicatorColor = "bg-natural-olive";
                  else if (count.avgScore >= 1.8) indicatorColor = "bg-natural-accent";

                  return (
                    <div key={dim.id} className="flex justify-between items-center bg-natural-sand/10 p-3 rounded-xl border border-natural-sand/60">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`} />
                        <div>
                          <span className="font-semibold text-xs sm:text-sm text-natural-ink block">{dim.name}</span>
                          <span className="text-[10px] text-natural-accent">{dim.subtitle}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-natural-olive bg-white border border-natural-sand rounded px-2 py-0.5">
                        Index: {count.avgScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Maturity Visualization */}
          <div className="lg:col-span-5 space-y-6 print-break-inside-avoid">
            <div className="bg-white rounded-2xl border border-natural-sand shadow-sm p-6 relative overflow-hidden flex flex-col justify-between print:shadow-none">
              <div className="flex items-center justify-between mb-4 no-print">
                <h4 className="font-serif font-bold text-natural-olive text-sm sm:text-base">
                  Maturity Visualization
                </h4>
                {/* Chart Type Toggle */}
                <div className="flex rounded-full bg-natural-sand/30 p-0.5 border border-natural-sand text-[10px] font-semibold">
                  <button
                    onClick={() => setChartType('radar')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      chartType === 'radar' ? 'bg-white text-natural-olive shadow-xs' : 'text-natural-accent'
                    }`}
                  >
                    Radar View
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      chartType === 'bar' ? 'bg-white text-natural-olive shadow-xs' : 'text-natural-accent'
                    }`}
                  >
                    Distribution View
                  </button>
                </div>
              </div>

              {/* Added a clean print title for chart */}
              <div className="hidden print:block mb-2">
                <h4 className="font-serif font-bold text-natural-olive text-xs">
                  Maturity {chartType === 'radar' ? 'Radar Profile' : 'Practice Distribution'}
                </h4>
              </div>

              <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'radar' ? (
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#D9D9C2" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#2C2C24', fontSize: 10, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[1.0, 3.0]} tick={{ fill: '#A8A878', fontSize: 9 }} />
                      <Radar
                        name="Maturity Level"
                        dataKey="Maturity"
                        stroke="#5A5A40"
                        fill="#D9D9C2"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="subject" tick={{ fill: '#2C2C24', fontSize: 8 }} />
                      <YAxis tick={{ fill: '#2C2C24', fontSize: 9 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="L1_Count" name="L1 Counts" fill="#D9D9C2" stackId="a" />
                      <Bar dataKey="L2_Count" name="L2 Counts" fill="#A8A878" stackId="a" />
                      <Bar dataKey="L3_Count" name="L3 Counts" fill="#5A5A40" stackId="a" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-natural-sand/60 text-[11px] text-natural-accent text-center flex flex-col items-center gap-1">
                <span className="font-semibold text-natural-ink">Maturity Scale Guide:</span>
                <div className="flex gap-4 mt-1.5 flex-wrap justify-center font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-natural-sand" />1.0 = L1 (Conventional)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-natural-accent" />2.0 = L2 (Developing)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-natural-olive" />3.0 = L3 (Transformative)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- TAB CONTENT: DIMENSION DEEP DIVE --- */}
      <div className={`${activeTab === 'breakdown' ? 'block' : 'hidden'} print:block space-y-6 print:space-y-4 print:mt-8 print:break-before-page`}>
        {/* Printable Section Title */}
        <div className="hidden print:block mb-4 border-b border-natural-sand pb-2">
          <h2 className="font-serif text-xl font-bold text-natural-olive">
            Dimension Deep-Dive Analysis
          </h2>
          <p className="text-xs text-natural-ink/75 font-mono">
            Detailed criteria, score indices, and self-assessment answer breakdowns.
          </p>
        </div>

        <div className="space-y-4">
          {dimensions.map(dim => {
            const isExpanded = expandedDimension === dim.id;
            const count = dimensionCounts[dim.id];
            const maxVal = Math.max(count.L1, count.L2, count.L3);
            const isTie = (count.L1 === maxVal ? 1 : 0) + (count.L2 === maxVal ? 1 : 0) + (count.L3 === maxVal ? 1 : 0) > 1;

            let label = "Conventional Practice (L1)";
            let labelColor = "bg-natural-sand/40 text-natural-ink border-natural-sand";
            let feedbackText = dim.feedback.L1;

            if (isTie) {
              label = "Mixed / Balanced Practice";
              labelColor = "bg-natural-sand text-natural-olive border-natural-sand";
              feedbackText = dim.feedback.tie || "Your practices are distributed evenly across different levels.";
            } else if (count.L3 === maxVal) {
              label = "Transformative Practice (L3)";
              labelColor = "bg-natural-sand/20 text-natural-olive border-natural-olive";
              feedbackText = dim.feedback.L3;
            } else if (count.L2 === maxVal) {
              label = "Developing Equity (L2)";
              labelColor = "bg-natural-accent/20 text-natural-olive border-natural-sand";
              feedbackText = dim.feedback.L2;
            }

            return (
              <div
                key={dim.id}
                className="bg-white rounded-2xl border border-natural-sand shadow-sm overflow-hidden transition-all duration-300 print-break-inside-avoid print:shadow-none"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setExpandedDimension(isExpanded ? null : dim.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-natural-sand/10 transition-colors cursor-pointer print:pointer-events-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-natural-sand/30 flex items-center justify-center font-serif font-bold text-natural-olive">
                      {dim.id}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-natural-olive text-base sm:text-lg">
                        {dim.name}
                      </h3>
                      <p className="text-xs text-natural-accent font-semibold">
                        {dim.subtitle} • Maturity Index: <span className="font-mono text-natural-olive font-bold">{count.avgScore}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border ${labelColor}`}>
                      {label}
                    </span>
                    <span className="no-print">
                      {isExpanded ? <ChevronDown size={18} className="text-natural-olive" /> : <ChevronRight size={18} className="text-natural-olive" />}
                    </span>
                  </div>
                </button>

                {/* Expanded Content - shown if expanded or unconditionally in print */}
                <div
                  className={`border-t border-natural-sand/40 p-6 space-y-6 ${
                    isExpanded ? 'block' : 'hidden print:block'
                  }`}
                >
                  {/* Sub-Header / Purpose */}
                  <div className="bg-natural-sand/10 border border-natural-sand rounded-xl p-4 text-xs text-natural-ink/90">
                    <span className="font-bold text-natural-olive block mb-1">M&E Purpose:</span>
                    {dim.purpose}
                  </div>

                  {/* Dimension Specific Feedback */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-natural-accent uppercase tracking-wider block">
                      Personalized Feedback & Strategy:
                    </span>
                    <p className="text-sm text-natural-ink/80 leading-relaxed font-light">
                      {feedbackText}
                    </p>
                  </div>

                  {/* Question Choices List */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-natural-accent uppercase tracking-wider block">
                      Your Answers Breakdown:
                    </span>

                    <div className="space-y-3">
                      {questions
                        .filter(q => q.dimensionId === dim.id)
                        .map(q => {
                          const levelSelected = answers[q.id];
                          const selectedOption = q.options.find(opt => opt.level === levelSelected);

                          let badgeColor = "bg-natural-sand/40 text-natural-ink border-natural-sand";
                          if (levelSelected === 'L3') badgeColor = "bg-natural-sand/20 text-natural-olive border-natural-olive";
                          else if (levelSelected === 'L2') badgeColor = "bg-natural-accent/20 text-natural-olive border-natural-sand";

                          return (
                            <div key={q.id} className="p-4 border border-natural-sand/40 rounded-xl bg-natural-sand/10 space-y-2 text-xs print-break-inside-avoid">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="font-semibold text-natural-ink">
                                  Q{q.id}. {q.text}
                                </span>
                                <span className={`self-start sm:self-auto text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                                  {levelSelected} Selected
                                </span>
                              </div>
                              {selectedOption && (
                                <div className="border-l-2 border-natural-sand pl-3 py-1 space-y-1">
                                  <p className="font-medium text-natural-ink">{selectedOption.text}</p>
                                  {selectedOption.description && (
                                    <p className="text-natural-ink/75 font-light leading-relaxed">
                                      {selectedOption.description}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- TAB CONTENT: INTERACTIVE ACTION PLANNER --- */}
      <div className={`${activeTab === 'planner' ? 'block' : 'hidden'} print:block space-y-6 print:space-y-4 print:mt-8 print:break-before-page`}>
        {/* Printable Section Title */}
        <div className="hidden print:block mb-4 border-b border-natural-sand pb-2">
          <h2 className="font-serif text-xl font-bold text-natural-olive">
            Equitable M&E Action Planner
          </h2>
          <p className="text-xs text-natural-ink/75 font-mono">
            Our custom implementation roadmap, targets, and strategic action plans.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-natural-sand shadow-sm p-6 sm:p-8 space-y-6 print:shadow-none print:p-0 print:border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-natural-olive text-lg sm:text-xl">
                Interactive Equity Action Planner
              </h3>
              <p className="text-xs sm:text-sm text-natural-accent font-semibold">
                Tailored development actions based on questions where your framework has room to deepen equity.
              </p>
            </div>

            {/* Save Plan Button */}
            <button
              onClick={saveActionPlan}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-natural-olive hover:bg-natural-olive/90 text-white font-serif font-bold text-sm rounded-full shadow-xs transition-all self-stretch sm:self-auto cursor-pointer no-print"
            >
              {saveSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
              <span>{saveSuccess ? 'Plan Saved!' : 'Save Action Plan'}</span>
            </button>
          </div>

          {/* Empty State */}
          {actionableRecommendations.length === 0 ? (
            <div className="text-center py-12 bg-natural-sand/10 rounded-2xl border border-dashed border-natural-sand">
              <Sparkles className="w-10 h-10 text-natural-olive mx-auto mb-3 animate-bounce" />
              <h4 className="font-serif font-bold text-natural-ink text-base">Perfect Score Achieved!</h4>
              <p className="text-xs text-natural-ink/70 max-w-sm mx-auto leading-relaxed mt-1">
                You have answered 'Highly Transformative (L3)' across all 30 assessment questions. Your practices are fully equity-centered!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {actionableRecommendations.map((rec, index) => {
                const isCompleted = !!completedActions[rec.questionId];
                const userNote = actionNotes[rec.questionId] || "";

                return (
                  <div
                    key={rec.questionId}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row gap-4 items-start print-break-inside-avoid ${
                      isCompleted
                        ? 'bg-natural-sand/10 border-natural-sand/60 opacity-70'
                        : 'bg-white border-natural-sand shadow-xs hover:shadow-sm'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleActionCompleted(rec.questionId)}
                      className="p-1 rounded text-natural-olive hover:text-natural-olive/80 transition-colors flex-shrink-0 cursor-pointer"
                      title={isCompleted ? "Mark in progress" : "Mark completed"}
                    >
                      {isCompleted ? <CheckSquare size={20} /> : <Square size={20} className="text-natural-accent" />}
                    </button>

                    {/* Content details */}
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-natural-sand/40 text-natural-olive px-2 py-0.5 rounded-md">
                            {rec.dimensionName}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-natural-sand/30 text-natural-ink px-1.5 py-0.5 rounded border border-natural-sand">
                            Selected: {rec.levelSelected}
                          </span>
                        </div>
                        <h4 className={`font-serif font-bold text-natural-ink text-sm sm:text-base leading-snug ${
                          isCompleted ? 'line-through text-natural-accent' : ''
                        }`}>
                          Recommendation: {rec.action}
                        </h4>
                        <p className="text-xs text-natural-accent leading-relaxed font-light font-mono italic">
                          Triggered by: "{rec.text}"
                        </p>
                      </div>

                      {/* Interactive Implementation Note Box */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">
                          Our Implementation Notes & Milestones:
                        </label>
                        <textarea
                          value={userNote}
                          onChange={(e) => handleNoteChange(rec.questionId, e.target.value)}
                          placeholder="Type target dates, assigned coordinators, or customized steps here..."
                          className="w-full text-xs p-3 rounded-xl border border-natural-sand bg-natural-sand/10 focus:bg-white focus:ring-1 focus:ring-natural-olive/30 focus:border-natural-olive focus:outline-none transition-all placeholder-natural-accent h-16 resize-none print:hidden"
                        />
                        {userNote ? (
                          <p className="hidden print:block text-xs text-natural-ink bg-natural-sand/10 border border-natural-sand/50 p-3 rounded-xl whitespace-pre-wrap">
                            {userNote}
                          </p>
                        ) : (
                          <p className="hidden print:block text-xs text-natural-accent italic">
                            No notes added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
