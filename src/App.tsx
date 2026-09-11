import { useState, useMemo } from 'react';
import { SimulationParams, ModelPreset } from './types';
import { DEFAULT_PARAMS, runSimulation } from './utils/simulation';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { ParameterControls } from './components/ParameterControls';
import { CostCharts } from './components/CostCharts';
import { TurnTable } from './components/TurnTable';
import { ExplainerSection } from './components/ExplainerSection';

const MainApp = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('gemini-3.8-flash');
  const { i18n } = useI18n();

  const result = useMemo(() => runSimulation(params), [params]);

  const handleParamsChange = (updated: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...updated }));
    // If pricing or cache changes manually, unselect preset
    if (
      updated.inputPricePerMillion !== undefined ||
      updated.outputPricePerMillion !== undefined ||
      updated.cacheDiscountRate !== undefined
    ) {
      setSelectedPresetId('');
    }
  };

  const handleSelectPreset = (preset: ModelPreset) => {
    setSelectedPresetId(preset.id);
    setParams((prev) => ({
      ...prev,
      inputPricePerMillion: preset.inputPrice,
      outputPricePerMillion: preset.outputPrice,
      cacheDiscountRate: preset.cacheDiscount,
    }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setSelectedPresetId('gemini-3.8-flash');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header params={params} result={result} onReset={handleReset} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI & Dynamic Outcome Metric Cards */}
        <MetricCards result={result} />

        {/* Interactive Parameter Controls & Model Presets Explorer */}
        <ParameterControls
          params={params}
          onChange={handleParamsChange}
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        {/* Visualization & Analytics Charts */}
        <CostCharts result={result} />

        {/* Turn-by-Turn Numerical Ledger Table */}
        <TurnTable result={result} />

        {/* Deep Dive Explainer Section */}
        <ExplainerSection result={result} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{i18n.header.title}</span>
          <span className="text-slate-400">
            Evaluating 4 Ingestion Architectures • Multimodal Document Caching
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}
