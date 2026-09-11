import { Trophy, Award, Clock, TrendingDown } from 'lucide-react';
import { SimulationResult } from '../types';
import { formatCurrency, formatTokens } from '../utils/simulation';
import { useI18n } from '../i18n/I18nContext';

interface MetricCardsProps {
  result: SimulationResult;
}

export const MetricCards = ({ result }: MetricCardsProps) => {
  const { i18n, t } = useI18n();

  const {
    totalQuestions,
    winnerAtEnd,
    lowestCostAtEnd,
    highestCostAtEnd,
    cases,
    turns,
  } = result;

  const firstTurn = turns[0];
  const lastTurn = turns[turns.length - 1];
  const winningCase = cases.find((c) => c.id === winnerAtEnd) || cases[0];
  const maxSavings = highestCostAtEnd - lowestCostAtEnd;
  const maxSavingsPct = highestCostAtEnd > 0 ? (maxSavings / highestCostAtEnd) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Most Cost-Effective Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>{i18n.metrics.winnerTitle}</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-emerald-700">
              {winningCase.name}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {t('metrics.winnerDesc', { totalQuestions })}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">{i18n.metrics.lowestCostLabel}</span>
          <span className="font-bold text-emerald-700 font-mono">
            {formatCurrency(lowestCostAtEnd)}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Max Savings:</span>
          <span className="font-semibold text-indigo-700 font-mono">
            {maxSavingsPct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Card 2: Cost Ranking of all 4 Cases */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>{t('metrics.rankingTitle', { q: totalQuestions })}</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="space-y-1 mt-1 text-xs">
            {cases.map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-slate-700 flex items-center gap-1">
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                      idx === 0
                        ? 'bg-emerald-600'
                        : idx === 1
                        ? 'bg-blue-600'
                        : idx === 2
                        ? 'bg-purple-600'
                        : 'bg-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[130px] font-medium" title={c.name}>
                    {c.name.replace('Case ', 'C')}
                  </span>
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(c.totalCost)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{i18n.metrics.costSpreadLabel}</span>
          <span className="font-mono font-semibold text-slate-800">
            {formatCurrency(highestCostAtEnd - lowestCostAtEnd)}
          </span>
        </div>
      </div>

      {/* Card 3: Cold-Start vs Final Turn Marginal Cost */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>{i18n.metrics.turn1CostTitle}</span>
            <TrendingDown className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">C1 (Images Upfront):</span>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(firstTurn.case1.turnCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">C2 (Tool Images):</span>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(firstTurn.case2.turnCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">C3 (Text + Image):</span>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(firstTurn.case3.turnCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">C4 (Iter Text + Image):</span>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(firstTurn.case4.turnCost)}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
          <span>Final Turn (Q{totalQuestions}):</span>
          <span className="font-mono text-emerald-700 font-semibold">
            C1: {formatCurrency(lastTurn.case1.turnCost)} • C3: {formatCurrency(lastTurn.case3.turnCost)}
          </span>
        </div>
      </div>

      {/* Card 4: Context Footprint & Memory Retention */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>{i18n.metrics.contextFootprintTitle}</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">C1 Final Context:</span>
              <span className="font-mono font-semibold text-slate-800">{formatTokens(lastTurn.case1.contextLengthEnd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">C2 Final Context:</span>
              <span className="font-mono font-semibold text-slate-800">{formatTokens(lastTurn.case2.contextLengthEnd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">C3 Final Context:</span>
              <span className="font-mono font-semibold text-slate-800">{formatTokens(lastTurn.case3.contextLengthEnd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">C4 Final Context:</span>
              <span className="font-mono font-semibold text-slate-800">{formatTokens(lastTurn.case4.contextLengthEnd)}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Cache Leverage:</span>
          <span className="font-semibold text-indigo-700">
            {((1 - result.params.cacheDiscountRate) * 100).toFixed(0)}% Billed
          </span>
        </div>
      </div>
    </div>
  );
};
