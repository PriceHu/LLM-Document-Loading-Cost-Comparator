import { useState } from 'react';
import { Sliders, Lock, Unlock, Zap, Layers, FileText, Coins, RotateCcw, Image, AlignLeft } from 'lucide-react';
import { SimulationParams, ModelPreset } from '../types';
import { MODEL_PRESETS } from '../utils/simulation';
import { useI18n } from '../i18n/I18nContext';

interface ParameterControlsProps {
  params: SimulationParams;
  onChange: (updated: Partial<SimulationParams>) => void;
  onSelectPreset: (preset: ModelPreset) => void;
  selectedPresetId?: string;
}

export const ParameterControls = ({
  params,
  onChange,
  onSelectPreset,
  selectedPresetId,
}: ParameterControlsProps) => {
  const { i18n } = useI18n();
  const [syncTokens, setSyncTokens] = useState<boolean>(true);
  const [activeProvider, setActiveProvider] = useState<string>('All');
  const [useCustomQuestions, setUseCustomQuestions] = useState<boolean>(!!params.customTotalQuestions);

  const imageTokensPerPage = params.imageTokensPerPage || params.tokensPerPage || 2000;
  const textTokensPerPage = params.textTokensPerPage || 500;
  const imagesReadPerQuestion = params.imagesReadPerQuestion ?? 1;

  const handleSyncedTokenChange = (value: number) => {
    if (syncTokens) {
      onChange({
        tokensPerQuestion: value,
        tokensPerToolCall: value,
        tokensPerAnswer: value,
      });
    }
  };

  const pagesPerQuestion = params.pagesPerToolCall * params.toolCallsPerQuestion;
  const autoQuestions = Math.max(1, Math.ceil(params.totalPages / Math.max(1, pagesPerQuestion)));
  const totalQuestions = params.customTotalQuestions || autoQuestions;

  const filteredPresets = activeProvider === 'All'
    ? MODEL_PRESETS
    : MODEL_PRESETS.filter((p) => p.provider === activeProvider);

  const activePreset = MODEL_PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header & Model Presets Explorer */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">{i18n.params.title}</h2>
            <span className="text-xs text-slate-500 font-normal hidden sm:inline">
              {i18n.params.subtitle}
            </span>
          </div>

          {/* Provider Filter Tabs */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-lg">
            {['All', 'OpenAI', 'Google', 'Anthropic', 'Qwen'].map((prov) => (
              <button
                key={prov}
                onClick={() => setActiveProvider(prov)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                  activeProvider === prov
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {prov === 'All' ? i18n.params.providerAll : prov}
              </button>
            ))}
          </div>
        </div>

        {/* Model Presets Grid / Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-0.5 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> {i18n.params.presetsLabel}:
          </span>
          {filteredPresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`group px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
                title={preset.description}
              >
                <span className="font-semibold">{preset.name}</span>
                {preset.badge && (
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {preset.badge}
                  </span>
                )}
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  ${preset.inputPrice} / ${(preset.cacheDiscount * 100).toFixed(0)}%{i18n.params.off}
                </span>
              </button>
            );
          })}
        </div>

        {activePreset && (
          <div className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md flex items-center justify-between">
            <span>{activePreset.description}</span>
            <span className="font-mono text-indigo-600 font-semibold shrink-0 ml-2">
              {i18n.params.input}: ${activePreset.inputPrice}/1M • {i18n.params.output}: ${activePreset.outputPrice}/1M • {i18n.params.cacheDiscount}: {(activePreset.cacheDiscount * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Document Sizing & Modalities */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {i18n.params.secDoc}
            </h3>
          </div>

          {/* Total Pages (N) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-total-pages" className="font-semibold text-slate-700">
                {i18n.params.totalPagesLabel}
              </label>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                {params.totalPages} {i18n.common.pages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="param-total-pages"
                type="range"
                min="10"
                max="500"
                step="5"
                value={params.totalPages}
                onChange={(e) => onChange({ totalPages: Number(e.target.value) })}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="1"
                max="5000"
                value={params.totalPages}
                onChange={(e) => onChange({ totalPages: Math.max(1, Number(e.target.value)) })}
                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Image Tokens per Page */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-image-tokens" className="font-semibold text-slate-700 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-blue-600" />
                <span>{i18n.params.imageTokensPerPageLabel}</span>
              </label>
              <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-xs">
                {imageTokensPerPage.toLocaleString()} t
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="param-image-tokens"
                type="range"
                min="500"
                max="4000"
                step="100"
                value={imageTokensPerPage}
                onChange={(e) => onChange({ imageTokensPerPage: Number(e.target.value), tokensPerPage: Number(e.target.value) })}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="100"
                max="10000"
                step="50"
                value={imageTokensPerPage}
                onChange={(e) => onChange({ imageTokensPerPage: Math.max(10, Number(e.target.value)), tokensPerPage: Math.max(10, Number(e.target.value)) })}
                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Text Tokens per Page */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-text-tokens" className="font-semibold text-slate-700 flex items-center gap-1">
                <AlignLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>{i18n.params.textTokensPerPageLabel}</span>
              </label>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                {textTokensPerPage.toLocaleString()} t
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="param-text-tokens"
                type="range"
                min="100"
                max="1500"
                step="50"
                value={textTokensPerPage}
                onChange={(e) => onChange({ textTokensPerPage: Number(e.target.value) })}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="50"
                max="5000"
                step="25"
                value={textTokensPerPage}
                onChange={(e) => onChange({ textTokensPerPage: Math.max(10, Number(e.target.value)) })}
                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Images Read per Question (in Cases 3 & 4) */}
          <div className="space-y-1.5 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-images-read-q" className="font-semibold text-indigo-900 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-indigo-600" />
                <span>{i18n.params.imagesReadPerQLabel}</span>
              </label>
              <span className="font-mono font-bold text-indigo-800 bg-white px-2 py-0.5 rounded text-xs border border-indigo-200">
                {imagesReadPerQuestion} {i18n.common.images} / Q
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="param-images-read-q"
                type="range"
                min="1"
                max="5"
                step="1"
                value={imagesReadPerQuestion}
                onChange={(e) => onChange({ imagesReadPerQuestion: Number(e.target.value) })}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="1"
                max="10"
                value={imagesReadPerQuestion}
                onChange={(e) => onChange({ imagesReadPerQuestion: Math.max(1, Number(e.target.value)) })}
                className="w-14 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>
            <p className="text-[11px] text-indigo-700/80 leading-tight">
              {i18n.params.imagesReadPerQDesc}
            </p>
          </div>

          {/* Pages per Tool Call (p) & Tool Calls (k) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label htmlFor="param-pages-per-tool" className="text-xs font-semibold text-slate-700 block">
                {i18n.params.pagesPerToolLabel}
              </label>
              <input
                id="param-pages-per-tool"
                type="number"
                min="1"
                max="30"
                value={params.pagesPerToolCall}
                onChange={(e) => onChange({ pagesPerToolCall: Math.max(1, Number(e.target.value)) })}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="param-tool-calls-per-q" className="text-xs font-semibold text-slate-700 block">
                {i18n.params.toolCallsPerQLabel}
              </label>
              <input
                id="param-tool-calls-per-q"
                type="number"
                min="1"
                max="10"
                value={params.toolCallsPerQuestion}
                onChange={(e) => onChange({ toolCallsPerQuestion: Math.max(1, Number(e.target.value)) })}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Head-to-Head Parity Note */}
          <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-snug">
            <span className="font-bold text-indigo-950 block mb-0.5">
              Head-to-Head Comparison:
            </span>
            <span className="text-indigo-800">
              {i18n.params.toolCallsHeadToHeadDesc}
            </span>
          </div>

          {/* Question Count Override */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-700">{i18n.params.customQuestionsTitle}</span>
              <button
                type="button"
                onClick={() => {
                  if (useCustomQuestions) {
                    setUseCustomQuestions(false);
                    onChange({ customTotalQuestions: undefined });
                  } else {
                    setUseCustomQuestions(true);
                    onChange({ customTotalQuestions: autoQuestions });
                  }
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                {useCustomQuestions ? i18n.params.customQuestionsCustom : i18n.params.customQuestionsAuto.replace('{count}', String(autoQuestions))}
              </button>
            </div>
            {useCustomQuestions && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={totalQuestions}
                  onChange={(e) => onChange({ customTotalQuestions: Math.max(1, Number(e.target.value)) })}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={totalQuestions}
                  onChange={(e) => onChange({ customTotalQuestions: Math.max(1, Number(e.target.value)) })}
                  className="w-14 px-1.5 py-0.5 text-xs border border-slate-300 rounded font-mono text-center"
                />
                <button
                  type="button"
                  title="Reset to Auto"
                  onClick={() => {
                    setUseCustomQuestions(false);
                    onChange({ customTotalQuestions: undefined });
                  }}
                  className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Token Sizing Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {i18n.params.secMessage}
              </h3>
            </div>
            <button
              onClick={() => {
                const nextSync = !syncTokens;
                setSyncTokens(nextSync);
                if (nextSync) {
                  onChange({
                    tokensPerToolCall: params.tokensPerQuestion,
                    tokensPerAnswer: params.tokensPerQuestion,
                  });
                }
              }}
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition font-medium ${
                syncTokens
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
              title={i18n.params.syncTitle}
            >
              {syncTokens ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{syncTokens ? i18n.params.syncEqual : i18n.params.syncIndependent}</span>
            </button>
          </div>

          {/* Tokens per Question (T_q) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-tokens-per-question" className="font-semibold text-slate-700">{i18n.params.tokensPerQ}</label>
              <span className="font-mono text-slate-800 font-bold">{params.tokensPerQuestion} t</span>
            </div>
            <input
              id="param-tokens-per-question"
              type="number"
              min="10"
              max="2000"
              step="10"
              value={params.tokensPerQuestion}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (syncTokens) {
                  handleSyncedTokenChange(val);
                } else {
                  onChange({ tokensPerQuestion: val });
                }
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Tokens per Tool Call (T_tc) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-tokens-per-tool-call" className="font-semibold text-slate-700">{i18n.params.tokensPerTool}</label>
              <span className="font-mono text-slate-800 font-bold">{params.tokensPerToolCall} t</span>
            </div>
            <input
              id="param-tokens-per-tool-call"
              type="number"
              min="10"
              max="2000"
              step="10"
              value={params.tokensPerToolCall}
              disabled={syncTokens}
              onChange={(e) => onChange({ tokensPerToolCall: Number(e.target.value) })}
              className={`w-full px-2.5 py-1.5 text-xs border rounded font-mono focus:ring-1 focus:ring-indigo-500 ${
                syncTokens ? 'bg-slate-50 text-slate-500 border-slate-200' : 'border-slate-300'
              }`}
            />
          </div>

          {/* Tokens per Answer (T_a) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-tokens-per-answer" className="font-semibold text-slate-700">{i18n.params.tokensPerAns}</label>
              <span className="font-mono text-slate-800 font-bold">{params.tokensPerAnswer} t</span>
            </div>
            <input
              id="param-tokens-per-answer"
              type="number"
              min="10"
              max="4000"
              step="20"
              value={params.tokensPerAnswer}
              disabled={syncTokens}
              onChange={(e) => onChange({ tokensPerAnswer: Number(e.target.value) })}
              className={`w-full px-2.5 py-1.5 text-xs border rounded font-mono focus:ring-1 focus:ring-indigo-500 ${
                syncTokens ? 'bg-slate-50 text-slate-500 border-slate-200' : 'border-slate-300'
              }`}
            />
          </div>

          {/* System Prompt Tokens (S) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-system-prompt-tokens" className="font-semibold text-slate-700">{i18n.params.sysPromptTokens}</label>
              <span className="font-mono text-slate-800 font-bold">{params.systemPromptTokens.toLocaleString()} t</span>
            </div>
            <input
              id="param-system-prompt-tokens"
              type="number"
              min="100"
              max="10000"
              step="100"
              value={params.systemPromptTokens}
              onChange={(e) => onChange({ systemPromptTokens: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Modality Stats Card */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Full Image Size ({params.totalPages} pgs):</span>
              <strong className="text-blue-700 font-mono">{(params.totalPages * imageTokensPerPage).toLocaleString()} tokens</strong>
            </div>
            <div className="flex justify-between">
              <span>Full Text Size ({params.totalPages} pgs):</span>
              <strong className="text-emerald-700 font-mono">{(params.totalPages * textTokensPerPage).toLocaleString()} tokens</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
              <span>Text Parsing Savings:</span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                -{(100 - (textTokensPerPage / imageTokensPerPage) * 100).toFixed(0)}% tokens
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Context Cache */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Coins className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {i18n.params.secPricing}
            </h3>
          </div>

          {/* Model Input Price */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-input-price" className="font-semibold text-slate-700">{i18n.params.modelInputPrice}</label>
              <span className="font-mono text-slate-800 font-bold">${params.inputPricePerMillion}</span>
            </div>
            <input
              id="param-input-price"
              type="number"
              min="0.01"
              max="20.0"
              step="0.05"
              value={params.inputPricePerMillion}
              onChange={(e) => onChange({ inputPricePerMillion: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Model Output Price */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-output-price" className="font-semibold text-slate-700">{i18n.params.modelOutputPrice}</label>
              <span className="font-mono text-slate-800 font-bold">${params.outputPricePerMillion}</span>
            </div>
            <input
              id="param-output-price"
              type="number"
              min="0.05"
              max="100.0"
              step="0.10"
              value={params.outputPricePerMillion}
              onChange={(e) => onChange({ outputPricePerMillion: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Cache Discount Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="param-cache-discount" className="font-semibold text-slate-700">{i18n.params.cacheDiscountRate}</label>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                {(params.cacheDiscountRate * 100).toFixed(0)}% {i18n.params.off}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="param-cache-discount"
                type="range"
                min="0.0"
                max="0.95"
                step="0.05"
                value={params.cacheDiscountRate}
                onChange={(e) => onChange({ cacheDiscountRate: Number(e.target.value) })}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs w-12 text-right text-slate-600">
                {((1 - params.cacheDiscountRate) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {i18n.params.cachedBilledAt.replace('{rate}', String(((1 - params.cacheDiscountRate) * 100).toFixed(0)))}
            </p>
          </div>

          {/* Effective Pricing Pill */}
          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs space-y-1.5">
            <div className="font-semibold text-indigo-950">Effective Cost Tiers:</div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>New Input:</span>
              <span className="font-mono font-bold text-slate-900">${params.inputPricePerMillion} / 1M</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Cached Read:</span>
              <span className="font-mono font-bold text-emerald-700">
                ${(params.inputPricePerMillion * (1 - params.cacheDiscountRate)).toFixed(4)} / 1M
              </span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Output Generation:</span>
              <span className="font-mono font-bold text-slate-900">${params.outputPricePerMillion} / 1M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
