import { useState } from 'react';
import { Table, Search } from 'lucide-react';
import { SimulationResult, CaseId } from '../types';
import { formatCurrency } from '../utils/simulation';
import { useI18n } from '../i18n/I18nContext';

interface TurnTableProps {
  result: SimulationResult;
}

export const TurnTable = ({ result }: TurnTableProps) => {
  const { i18n } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTurns = result.turns.filter((turn) => {
    if (!searchQuery.trim()) return true;
    return turn.turnIndex.toString().includes(searchQuery.trim());
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{i18n.table.title}</h3>
            <p className="text-xs text-slate-500">{i18n.table.subtitle}</p>
          </div>
        </div>

        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={i18n.table.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3">{i18n.table.colQuestion}</th>
              <th className="py-2.5 px-3 text-emerald-800">C1 (Images Upfront)</th>
              <th className="py-2.5 px-3 text-blue-800">C2 (Tool Images)</th>
              <th className="py-2.5 px-3 text-purple-800">C3 (Text + Image Tool)</th>
              <th className="py-2.5 px-3 text-amber-800">C4 (Iter Text + Image)</th>
              <th className="py-2.5 px-3 text-slate-700">Turn Winner</th>
              <th className="py-2.5 px-3 text-slate-700">Cumulative Leader</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {filteredTurns.map((turn) => {
              const turnCosts = [
                { id: 'case1' as CaseId, cost: turn.case1.turnCost, label: 'C1' },
                { id: 'case2' as CaseId, cost: turn.case2.turnCost, label: 'C2' },
                { id: 'case3' as CaseId, cost: turn.case3.turnCost, label: 'C3' },
                { id: 'case4' as CaseId, cost: turn.case4.turnCost, label: 'C4' },
              ];
              turnCosts.sort((a, b) => a.cost - b.cost);
              const turnWinner = turnCosts[0];

              const cumCosts = [
                { id: 'case1' as CaseId, cost: turn.case1.cumulativeCost, label: 'C1' },
                { id: 'case2' as CaseId, cost: turn.case2.cumulativeCost, label: 'C2' },
                { id: 'case3' as CaseId, cost: turn.case3.cumulativeCost, label: 'C3' },
                { id: 'case4' as CaseId, cost: turn.case4.cumulativeCost, label: 'C4' },
              ];
              cumCosts.sort((a, b) => a.cost - b.cost);
              const cumWinner = cumCosts[0];

              return (
                <tr key={turn.turnIndex} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    Q{turn.turnIndex}
                  </td>
                  {/* Case 1 */}
                  <td className="py-2.5 px-3 text-emerald-800">
                    <span className="font-semibold">{formatCurrency(turn.case1.turnCost)}</span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      Cum: {formatCurrency(turn.case1.cumulativeCost)}
                    </span>
                  </td>
                  {/* Case 2 */}
                  <td className="py-2.5 px-3 text-blue-800">
                    <span className="font-semibold">{formatCurrency(turn.case2.turnCost)}</span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      Cum: {formatCurrency(turn.case2.cumulativeCost)}
                    </span>
                  </td>
                  {/* Case 3 */}
                  <td className="py-2.5 px-3 text-purple-800">
                    <span className="font-semibold">{formatCurrency(turn.case3.turnCost)}</span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      Cum: {formatCurrency(turn.case3.cumulativeCost)}
                    </span>
                  </td>
                  {/* Case 4 */}
                  <td className="py-2.5 px-3 text-amber-800">
                    <span className="font-semibold">{formatCurrency(turn.case4.turnCost)}</span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      Cum: {formatCurrency(turn.case4.cumulativeCost)}
                    </span>
                  </td>
                  {/* Turn Winner */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-sans ${
                        turnWinner.id === 'case1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : turnWinner.id === 'case2'
                          ? 'bg-blue-100 text-blue-800'
                          : turnWinner.id === 'case3'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {turnWinner.label} ({formatCurrency(turnWinner.cost)})
                    </span>
                  </td>
                  {/* Cum Winner */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-sans ${
                        cumWinner.id === 'case1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cumWinner.id === 'case2'
                          ? 'bg-blue-100 text-blue-800'
                          : cumWinner.id === 'case3'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cumWinner.label} ({formatCurrency(cumWinner.cost)})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
