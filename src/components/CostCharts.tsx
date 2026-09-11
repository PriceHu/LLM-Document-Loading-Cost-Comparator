import { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Clock,
  PieChart,
  Trophy,
  Eye,
  EyeOff,
  Download,
  FileImage,
  Check,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { SimulationResult, CaseId } from '../types';
import { formatCurrency, formatTokens, MODEL_PRESETS } from '../utils/simulation';
import { useI18n } from '../i18n/I18nContext';

interface CostChartsProps {
  result: SimulationResult;
}

const CASE_COLORS = {
  case1: '#059669', // Emerald
  case2: '#2563eb', // Blue
  case3: '#7c3aed', // Purple
  case4: '#ea580c', // Orange
};

export const CostCharts = ({ result }: CostChartsProps) => {
  const { i18n, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'cumulative' | 'marginal' | 'context' | 'breakdown'>('cumulative');
  const [curveType, setCurveType] = useState<'monotone' | 'linear'>('monotone');
  const [visibleCases, setVisibleCases] = useState<Record<CaseId, boolean>>({
    case1: true,
    case2: true,
    case3: true,
    case4: true,
  });

  const visualContainerRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportMenuOpen]);

  const { turns, winnerAtEnd, cases, params } = result;

  const activePreset = MODEL_PRESETS.find(
    (p) =>
      Math.abs(p.inputPrice - params.inputPricePerMillion) < 0.001 &&
      Math.abs(p.outputPrice - params.outputPricePerMillion) < 0.001
  );
  const currentModelName = activePreset ? activePreset.name : 'Custom Model';

  const handleExport = async (format: 'png' | 'svg') => {
    if (!visualContainerRef.current || isExporting) return;
    setIsExporting(true);
    setExportMenuOpen(false);

    try {
      const node = visualContainerRef.current;
      let dataUrl = '';
      if (format === 'png') {
        dataUrl = await toPng(node, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          cacheBust: true,
        });
      } else {
        dataUrl = await toSvg(node, {
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
      }

      const cleanModelName = currentModelName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${cleanModelName}_${activeTab}_${language}_${timestamp}.${format}`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(format.toUpperCase());
      setTimeout(() => setExportSuccess(null), 2500);
    } catch (err) {
      console.error('Failed to export visual:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleCase = (id: CaseId) => {
    setVisibleCases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Chart data formatting for all 4 cases
  const chartData = turns.map((t) => ({
    question: `Q${t.turnIndex}`,
    qNum: t.turnIndex,
    // Cumulative Costs
    case1CumCost: Number(t.case1.cumulativeCost.toFixed(4)),
    case2CumCost: Number(t.case2.cumulativeCost.toFixed(4)),
    case3CumCost: Number(t.case3.cumulativeCost.toFixed(4)),
    case4CumCost: Number(t.case4.cumulativeCost.toFixed(4)),
    // Per-turn Marginal Costs
    case1TurnCost: Number(t.case1.turnCost.toFixed(4)),
    case2TurnCost: Number(t.case2.turnCost.toFixed(4)),
    case3TurnCost: Number(t.case3.turnCost.toFixed(4)),
    case4TurnCost: Number(t.case4.turnCost.toFixed(4)),
    // Context lengths
    case1Context: t.case1.contextLengthEnd,
    case2Context: t.case2.contextLengthEnd,
    case3Context: t.case3.contextLengthEnd,
    case4Context: t.case4.contextLengthEnd,
  }));

  const legendFormatter = (value: string) => {
    switch (value) {
      case 'case1CumCost':
      case 'case1TurnCost':
      case 'case1Context':
        return i18n.charts.legendC1;
      case 'case2CumCost':
      case 'case2TurnCost':
      case 'case2Context':
        return i18n.charts.legendC2;
      case 'case3CumCost':
      case 'case3TurnCost':
      case 'case3Context':
        return i18n.charts.legendC3;
      case 'case4CumCost':
      case 'case4TurnCost':
      case 'case4Context':
        return i18n.charts.legendC4;
      default:
        return value;
    }
  };

  const winningCase = cases.find((c) => c.id === winnerAtEnd);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Chart navigation tabs & controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setActiveTab('cumulative')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'cumulative'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{i18n.charts.tabCumulative}</span>
          </button>
          <button
            onClick={() => setActiveTab('marginal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'marginal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{i18n.charts.tabMarginal}</span>
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'context'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{i18n.charts.tabContext}</span>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>{i18n.charts.tabBreakdown}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Curve Style Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setCurveType('monotone')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${
                curveType === 'monotone'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {i18n.charts.curveSmooth}
            </button>
            <button
              type="button"
              onClick={() => setCurveType('linear')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${
                curveType === 'linear'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {i18n.charts.curveLinear}
            </button>
          </div>

          {/* Winner Badge */}
          {winningCase && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {i18n.common.winner}: <strong>{winningCase.name}</strong>
              </span>
            </div>
          )}

          {/* Export Visual Button & Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              id="btn-export-visual"
              type="button"
              onClick={() => setExportMenuOpen((prev) => !prev)}
              disabled={isExporting}
              title={i18n.charts.exportBtn}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              ) : exportSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Download className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>
                {isExporting
                  ? i18n.charts.exporting
                  : exportSuccess
                  ? `${exportSuccess} ✓`
                  : i18n.charts.exportBtn}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {exportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  id="btn-export-png"
                  type="button"
                  onClick={() => handleExport('png')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-left cursor-pointer"
                >
                  <FileImage className="w-4 h-4 text-indigo-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{i18n.charts.exportPng}</span>
                    <span className="text-[10px] text-slate-400">2x Retina Image</span>
                  </div>
                </button>
                <button
                  id="btn-export-svg"
                  type="button"
                  onClick={() => handleExport('svg')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-left cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{i18n.charts.exportSvg}</span>
                    <span className="text-[10px] text-slate-400">Scalable Vector</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exportable Visual Area: Title, Chart Canvas, and Dedicated Legend */}
      <div
        ref={visualContainerRef}
        id="exportable-visual-area"
        className="bg-white rounded-xl border border-slate-100 p-3 sm:p-4 space-y-3"
      >
        {/* Chart Title & Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {activeTab === 'cumulative' && i18n.charts.cumTitle}
              {activeTab === 'marginal' && i18n.charts.marginalTitle}
              {activeTab === 'context' && i18n.charts.contextTitle}
              {activeTab === 'breakdown' && i18n.charts.breakdownTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'cumulative' && i18n.charts.cumSubtitle}
              {activeTab === 'marginal' && i18n.charts.marginalSubtitle}
              {activeTab === 'context' && i18n.charts.contextSubtitle}
              {activeTab === 'breakdown' && i18n.charts.breakdownSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 shrink-0">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">{currentModelName}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{params.totalPages} {i18n.common.pages}</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              {(params.cacheDiscountRate * 100).toFixed(0)}% Off
            </span>
          </div>
        </div>

        {/* Chart Canvas with Dedicated Right-Side Legend Bar */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 pt-1">
        {/* Left / Center: Primary Chart Plot (takes full remaining width) */}
        <div className="flex-1 min-w-0" style={{ height: 380, minHeight: 340 }}>
          {activeTab === 'cumulative' && (
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 5, bottom: 20 }}>
                <defs>
                  <linearGradient id="c1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CASE_COLORS.case1} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CASE_COLORS.case1} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="c2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CASE_COLORS.case2} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CASE_COLORS.case2} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="c3Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CASE_COLORS.case3} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CASE_COLORS.case3} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="c4Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CASE_COLORS.case4} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CASE_COLORS.case4} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="question" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  tickFormatter={(v) => `$${v}`}
                  width={60}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`$${Number(value).toFixed(4)}`, legendFormatter(String(name))]}
                  labelFormatter={(label) => `Turn: ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                {visibleCases.case1 && (
                  <Area
                    type={curveType}
                    dataKey="case1CumCost"
                    stroke={CASE_COLORS.case1}
                    strokeWidth={2.5}
                    fill="url(#c1Grad)"
                    name="case1CumCost"
                  />
                )}
                {visibleCases.case2 && (
                  <Area
                    type={curveType}
                    dataKey="case2CumCost"
                    stroke={CASE_COLORS.case2}
                    strokeWidth={2.5}
                    fill="url(#c2Grad)"
                    name="case2CumCost"
                  />
                )}
                {visibleCases.case3 && (
                  <Area
                    type={curveType}
                    dataKey="case3CumCost"
                    stroke={CASE_COLORS.case3}
                    strokeWidth={2.5}
                    fill="url(#c3Grad)"
                    name="case3CumCost"
                  />
                )}
                {visibleCases.case4 && (
                  <Area
                    type={curveType}
                    dataKey="case4CumCost"
                    stroke={CASE_COLORS.case4}
                    strokeWidth={2.5}
                    fill="url(#c4Grad)"
                    name="case4CumCost"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'marginal' && (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={chartData} margin={{ top: 10, right: 15, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="question" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  tickFormatter={(v) => `$${v}`}
                  width={60}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`$${Number(value).toFixed(4)}`, legendFormatter(String(name))]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                {visibleCases.case1 && (
                  <Bar dataKey="case1TurnCost" fill={CASE_COLORS.case1} radius={[2, 2, 0, 0]} name="case1TurnCost" />
                )}
                {visibleCases.case2 && (
                  <Bar dataKey="case2TurnCost" fill={CASE_COLORS.case2} radius={[2, 2, 0, 0]} name="case2TurnCost" />
                )}
                {visibleCases.case3 && (
                  <Bar dataKey="case3TurnCost" fill={CASE_COLORS.case3} radius={[2, 2, 0, 0]} name="case3TurnCost" />
                )}
                {visibleCases.case4 && (
                  <Bar dataKey="case4TurnCost" fill={CASE_COLORS.case4} radius={[2, 2, 0, 0]} name="case4TurnCost" />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'context' && (
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="question" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  tickFormatter={(v) => formatTokens(v)}
                  width={65}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [formatTokens(Number(value)), legendFormatter(String(name))]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                {visibleCases.case1 && (
                  <Line
                    type={curveType}
                    dataKey="case1Context"
                    stroke={CASE_COLORS.case1}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                    name="case1Context"
                  />
                )}
                {visibleCases.case2 && (
                  <Line
                    type={curveType}
                    dataKey="case2Context"
                    stroke={CASE_COLORS.case2}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                    name="case2Context"
                  />
                )}
                {visibleCases.case3 && (
                  <Line
                    type={curveType}
                    dataKey="case3Context"
                    stroke={CASE_COLORS.case3}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                    name="case3Context"
                  />
                )}
                {visibleCases.case4 && (
                  <Line
                    type={curveType}
                    dataKey="case4Context"
                    stroke={CASE_COLORS.case4}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                    name="case4Context"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'breakdown' && (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={cases.map((c) => ({
                  name:
                    c.id === 'case1'
                      ? i18n.common.case1Short
                      : c.id === 'case2'
                      ? i18n.common.case2Short
                      : c.id === 'case3'
                      ? i18n.common.case3Short
                      : i18n.common.case4Short,
                  cost: Number(c.totalCost.toFixed(4)),
                  tokens: c.totalTokens,
                  context: c.finalContextLength,
                }))}
                margin={{ top: 10, right: 15, left: 5, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  tickFormatter={(v) => `$${v}`}
                  width={60}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toFixed(4)}`, i18n.common.cost]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="cost" fill="#4f46e5" radius={[4, 4, 0, 0]} name={i18n.charts.tabCumulative} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Right-Side Dedicated Legend & Filter Panel */}
        <div className="w-full md:w-56 lg:w-64 shrink-0 flex flex-col justify-between gap-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-xs font-bold text-slate-800">
              <span>{i18n.charts.legendTitle}</span>
              <span className="text-[10px] font-normal text-slate-500">{i18n.charts.legendToggle}</span>
            </div>

            {/* Case 1 */}
            <button
              type="button"
              onClick={() => toggleCase('case1')}
              className={`w-full p-2 rounded-lg border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                visibleCases.case1
                  ? 'bg-white border-emerald-300 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 opacity-60 line-through'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>{i18n.common.case1Short}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-emerald-700">
                    {formatCurrency(result.totalCostCase1)}
                  </span>
                  {visibleCases.case1 ? (
                    <Eye className="w-3 h-3 text-slate-400" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 pl-4">{i18n.charts.c1Sub}</span>
            </button>

            {/* Case 2 */}
            <button
              type="button"
              onClick={() => toggleCase('case2')}
              className={`w-full p-2 rounded-lg border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                visibleCases.case2
                  ? 'bg-white border-blue-300 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 opacity-60 line-through'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>{i18n.common.case2Short}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-blue-700">
                    {formatCurrency(result.totalCostCase2)}
                  </span>
                  {visibleCases.case2 ? (
                    <Eye className="w-3 h-3 text-slate-400" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 pl-4">
                {i18n.charts.c2Sub.replace('{calls}', String(params.toolCallsPerQuestion))}
              </span>
            </button>

            {/* Case 3 */}
            <button
              type="button"
              onClick={() => toggleCase('case3')}
              className={`w-full p-2 rounded-lg border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                visibleCases.case3
                  ? 'bg-white border-purple-300 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 opacity-60 line-through'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>{i18n.common.case3Short}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-purple-700">
                    {formatCurrency(result.totalCostCase3)}
                  </span>
                  {visibleCases.case3 ? (
                    <Eye className="w-3 h-3 text-slate-400" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 pl-4">{i18n.charts.c3Sub}</span>
            </button>

            {/* Case 4 */}
            <button
              type="button"
              onClick={() => toggleCase('case4')}
              className={`w-full p-2 rounded-lg border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                visibleCases.case4
                  ? 'bg-white border-amber-300 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 opacity-60 line-through'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span>{i18n.common.case4Short}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-amber-700">
                    {formatCurrency(result.totalCostCase4)}
                  </span>
                  {visibleCases.case4 ? (
                    <Eye className="w-3 h-3 text-slate-400" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 pl-4">
                {i18n.charts.c4Sub.replace('{calls}', String(params.toolCallsPerQuestion))}
              </span>
            </button>
          </div>

          {/* Footnote on caching and parity */}
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>{i18n.charts.cacheDiscountFootnote}</span>
              <span className="font-semibold text-emerald-700">
                {(params.cacheDiscountRate * 100).toFixed(0)}% Off
              </span>
            </div>
            <div className="flex justify-between">
              <span>{i18n.charts.retrievalParityFootnote}</span>
              <span className="font-semibold text-indigo-700">
                k = {params.toolCallsPerQuestion} {i18n.charts.callsPerQ}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Export Footer watermark */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>LLM Document Ingestion Cost Comparator</span>
        <span>
          {currentModelName} • {params.totalPages} {i18n.common.pages} • {result.turns.length} {i18n.common.questions}
        </span>
      </div>
    </div>
  </div>
  );
};
