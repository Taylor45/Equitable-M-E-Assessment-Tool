import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Award, Sparkles, Printer, RotateCcw, ChevronRight, ChevronDown,
  ClipboardList, AlertCircle, Compass, Users, BarChart3,
  TrendingUp, ArrowUpRight, HelpCircle
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-natural-sand shadow-lg font-sans max-w-[240px] text-left">
        <p className="font-serif font-bold text-natural-olive text-xs sm:text-sm mb-1.5 border-b border-natural-sand/60 pb-1">
          {data.subject}
        </p>
        <div className="space-y-1 text-[11px] text-natural-ink">
          <div className="flex items-center justify-between font-medium">
            <span>Avg Maturity:</span>
            <span className="font-mono text-natural-olive font-bold">{Number(data.Maturity).toFixed(1)} / 3.0</span>
          </div>
          <div className="flex items-center justify-between pt-1 font-light text-natural-accent">
            <span>Conventional (L1):</span>
            <span className="font-mono font-semibold">{data.L1_Count} items</span>
          </div>
          <div className="flex items-center justify-between font-light text-natural-accent">
            <span>Developing (L2):</span>
            <span className="font-mono font-semibold">{data.L2_Count} items</span>
          </div>
          <div className="flex items-center justify-between font-light text-natural-accent">
            <span>Transformative (L3):</span>
            <span className="font-mono font-semibold">{data.L3_Count} items</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomRadiusTick = ({ x, y, payload, isMobile, cx, cy, radius, angle }: any) => {
  if (!payload || payload.value === undefined) return null;
  const valStr = Number(payload.value).toFixed(1);
  const boxWidth = isMobile ? 24 : 28;
  const boxHeight = isMobile ? 14 : 16;

  let tickX = x;
  let tickY = y;
  if (cx !== undefined && cy !== undefined && radius !== undefined && angle !== undefined) {
    const angleRad = -angle * Math.PI / 180;
    tickX = cx + radius * Math.cos(angleRad);
    tickY = cy + radius * Math.sin(angleRad);
  }

  return (
    <g transform={`translate(${tickX}, ${tickY})`}>
      <rect
        x={-boxWidth / 2}
        y={-boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={4}
        fill="#FFFFFF"
        stroke="#D9D9C2"
        strokeWidth={1}
        className="shadow-xs"
      />
      <text
        x={0}
        y={isMobile ? 3 : 3.5}
        textAnchor="middle"
        fill="#5A5A40"
        fontSize={isMobile ? 8 : 9}
        fontWeight="600"
        className="font-mono"
      >
        {valStr}
      </text>
    </g>
  );
};

export default function FinalDashboard({ answers, onReset }: FinalDashboardProps) {
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Monitor screen size for robust chart responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      // On mobile, use shorter names for clean layout display
      let subjectName = d.name;
      if (isMobile) {
        if (d.name.includes(" & ")) {
          subjectName = d.name.split(" & ")[0]; // e.g. "Theory", "Concepts", "Methods", etc.
        }
      }
      return {
        subject: subjectName,
        Maturity: count.avgScore,
        L1_Count: count.L1,
        L2_Count: count.L2,
        L3_Count: count.L3,
        fullMark: 3.0
      };
    });
  }, [dimensionCounts, isMobile]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0 print:space-y-4 max-w-5xl mx-auto print:max-w-full print:w-full print:mx-0">
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

      {/* Printable Report Wrapper */}
      <div className="w-full">
        <div className="space-y-8 print:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-8 print:gap-6 items-start">
              
              {/* Left Column: Overall Score Badge & Description */}
              <div className="md:col-span-7 print:col-span-7 space-y-6">
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

              <div className="p-6 sm:p-8">
                {/* Summary grid */}
                <div className="grid grid-cols-3 gap-4">
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
          <div className="md:col-span-5 print:col-span-5 space-y-6 print-break-inside-avoid min-w-0 w-full overflow-hidden">
            <div className="bg-white rounded-2xl border border-natural-sand shadow-sm p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between print:shadow-none w-full min-w-0">
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

              {/* Interactive Screen-Only Chart Wrapper */}
              <div className="h-64 sm:h-72 w-full flex items-center justify-center print:hidden min-w-0 overflow-hidden relative">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'radar' ? (
                    <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? "58%" : "78%"} data={chartData}>
                      <PolarGrid stroke="#D9D9C2" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#2C2C24', fontSize: isMobile ? 8 : 10, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[1.0, 3.0]} tick={<CustomRadiusTick isMobile={isMobile} />} />
                      <Tooltip content={<CustomTooltip />} />
                      <Radar
                        name="Maturity Level"
                        dataKey="Maturity"
                        stroke="#5A5A40"
                        strokeWidth={2}
                        fill="#A8A878"
                        fillOpacity={0.3}
                        dot={{ r: 4.5, fill: '#5A5A40', stroke: '#fff', strokeWidth: 1.5 }}
                        activeDot={{ r: 6.5, fill: '#5A5A40', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </RadarChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: isMobile ? 55 : 65 }}>
                      <XAxis
                        dataKey="subject"
                        tick={{ fill: '#2C2C24', fontSize: isMobile ? 7.5 : 8.5, dy: 6 }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={isMobile ? 55 : 65}
                      />
                      <YAxis tick={{ fill: '#2C2C24', fontSize: isMobile ? 8 : 9 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: isMobile ? 8 : 9, paddingBottom: 8 }} />
                      <Bar dataKey="L1_Count" name="L1 Counts" fill="#D9D9C2" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="L2_Count" name="L2 Counts" fill="#A8A878" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="L3_Count" name="L3 Counts" fill="#5A5A40" stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* High-Fidelity Print-Only Chart Wrapper - rendered offscreen in screen mode to ensure Recharts can measure dimensions on mount, but perfectly visible during print */}
              <div 
                className="absolute left-[-9999px] top-0 opacity-0 pointer-events-none print:static print:opacity-100 print:pointer-events-auto print:flex print:items-center print:justify-center print:w-full print:mx-auto" 
                style={{ height: '240px', width: '340px' }}
              >
                {chartType === 'radar' ? (
                  <RadarChart cx="50%" cy="50%" outerRadius="58%" data={chartData} width={340} height={240}>
                    <PolarGrid stroke="#D9D9C2" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#2C2C24', fontSize: 9, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[1.0, 3.0]} tick={<CustomRadiusTick isMobile={false} />} />
                    <Radar
                      name="Maturity Level"
                      dataKey="Maturity"
                      stroke="#5A5A40"
                      strokeWidth={2}
                      fill="#A8A878"
                      fillOpacity={0.3}
                      dot={{ r: 4, fill: '#5A5A40', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                  </RadarChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 55 }} width={340} height={240}>
                    <XAxis
                      dataKey="subject"
                      tick={{ fill: '#2C2C24', fontSize: 8.5, dy: 6 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={55}
                    />
                    <YAxis tick={{ fill: '#2C2C24', fontSize: 9 }} />
                    <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 9, paddingBottom: 6 }} />
                    <Bar dataKey="L1_Count" name="L1 Counts" fill="#D9D9C2" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="L2_Count" name="L2 Counts" fill="#A8A878" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="L3_Count" name="L3 Counts" fill="#5A5A40" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
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



        {/* Printable Custom Page Number Container */}
        <div className="hidden print:block print-page-number"></div>
      </div>
    </div>
  );
}
