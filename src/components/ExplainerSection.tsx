import { BookOpen, Zap, AlertCircle, Compass, Layers, CheckCircle2, Image, FileText } from 'lucide-react';
import { SimulationResult } from '../types';
import { formatCurrency, formatTokens } from '../utils/simulation';
import { useI18n } from '../i18n/I18nContext';

interface ExplainerSectionProps {
  result: SimulationResult;
}

export const ExplainerSection = ({ result }: ExplainerSectionProps) => {
  const { i18n } = useI18n();
  const { cases, params } = result;

  const imageTokensPerPage = params.imageTokensPerPage || params.tokensPerPage || 2000;
  const textTokensPerPage = params.textTokensPerPage || 500;
  const imagesReadPerQuestion = params.imagesReadPerQuestion ?? 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">{i18n.explainer.title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">{i18n.explainer.subtitle}</p>
      </div>

      {/* 4 Architecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Case 1 */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Image className="w-4 h-4 text-emerald-600" />
              <span>{i18n.explainer.case1Title}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              0 Tool Calls / Q
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {i18n.explainer.case1Desc}
          </p>
          <div className="pt-1 text-[11px] text-slate-500 font-mono flex justify-between border-t border-emerald-100">
            <span>Turn 1 Doc Size: {formatTokens(params.totalPages * imageTokensPerPage)} t</span>
            <span className="text-emerald-700 font-semibold">Total: {formatCurrency(result.totalCostCase1)}</span>
          </div>
        </div>

        {/* Case 2 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{i18n.explainer.case2Title}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
              {params.toolCallsPerQuestion} Tool Calls / Q
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {i18n.explainer.case2Desc}
          </p>
          <div className="pt-1 text-[11px] text-slate-500 font-mono flex justify-between border-t border-blue-100">
            <span>Retrieval Rate: {params.pagesPerToolCall * params.toolCallsPerQuestion} pgs/Q</span>
            <span className="text-blue-700 font-semibold">Total: {formatCurrency(result.totalCostCase2)}</span>
          </div>
        </div>

        {/* Case 3 */}
        <div className="rounded-xl border border-purple-200 bg-purple-50/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>{i18n.explainer.case3Title}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
              {imagesReadPerQuestion} Image Tool Call / Q
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {i18n.explainer.case3Desc}
          </p>
          <div className="pt-1 text-[11px] text-slate-500 font-mono flex justify-between border-t border-purple-100">
            <span>Turn 1 Text Doc: {formatTokens(params.totalPages * textTokensPerPage)} t</span>
            <span className="text-purple-700 font-semibold">Total: {formatCurrency(result.totalCostCase3)}</span>
          </div>
        </div>

        {/* Case 4 */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>{i18n.explainer.case4Title}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
              {params.toolCallsPerQuestion + 1} Tool Calls / Q
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {i18n.explainer.case4Desc}
          </p>
          <div className="pt-1 text-[11px] text-slate-500 font-mono flex justify-between border-t border-amber-100">
            <span>{params.toolCallsPerQuestion} Text Calls + 1 Image Call</span>
            <span className="text-amber-700 font-semibold">Total: {formatCurrency(result.totalCostCase4)}</span>
          </div>
        </div>
      </div>

      {/* Architectural Comparison Matrix Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{i18n.explainer.tableTitle}</span>
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">{i18n.explainer.colCase}</th>
                <th className="py-2.5 px-3">{i18n.explainer.colStrategy}</th>
                <th className="py-2.5 px-3 text-center">{i18n.explainer.colToolCallsPerQ}</th>
                <th className="py-2.5 px-3">Cumulative Total</th>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">{i18n.explainer.colIdealFor}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => {
                const isWinner = c.costRank === 1;
                return (
                  <tr
                    key={c.id}
                    className={`transition ${isWinner ? 'bg-emerald-50/50 font-medium' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {c.id === 'case1' && 'Pure Image Ingestion upfront'}
                      {c.id === 'case2' && 'Sequential page images via tool'}
                      {c.id === 'case3' && 'Full text upfront + 1 image call'}
                      {c.id === 'case4' && 'Iterative text pages + 1 image call'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                      {c.id === 'case1' && '0'}
                      {c.id === 'case2' && `${params.toolCallsPerQuestion}`}
                      {c.id === 'case3' && '1'}
                      {c.id === 'case4' && `${params.toolCallsPerQuestion + 1}`}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {formatCurrency(c.totalCost)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isWinner
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.costRank === 2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{c.costRank} {isWinner ? '★ Best' : ''}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {c.id === 'case1' && 'Image-heavy docs where layout is critical everywhere'}
                      {c.id === 'case2' && 'Targeted lookup in short single-turn queries'}
                      {c.id === 'case3' && 'General enterprise PDFs: cheap text cache + targeted image verification'}
                      {c.id === 'case4' && 'Huge documents (1000+ pgs) where text cannot fit upfront'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineering Insights */}
      <div className="pt-2 border-t border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{i18n.explainer.insightTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{i18n.explainer.insight1Title}</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {i18n.explainer.insight1Desc}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{i18n.explainer.insight2Title}</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {i18n.explainer.insight2Desc}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{i18n.explainer.insight3Title}</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {i18n.explainer.insight3Desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
