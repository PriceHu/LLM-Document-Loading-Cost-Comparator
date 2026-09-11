import { BookOpen, Cpu, Sparkles, RefreshCw, Globe } from 'lucide-react';
import { SimulationParams, SimulationResult } from '../types';
import { formatTokens } from '../utils/simulation';
import { useI18n } from '../i18n/I18nContext';
import { Language } from '../i18n/translations';

interface HeaderProps {
  params: SimulationParams;
  result: SimulationResult;
  onReset: () => void;
}

export const Header = ({ params, result, onReset }: HeaderProps) => {
  const { language, setLanguage, i18n, t } = useI18n();
  const imageTokensPerPage = params.imageTokensPerPage || params.tokensPerPage || 2000;
  const totalDocTokens = params.totalPages * imageTokensPerPage;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {i18n.header.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {i18n.header.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Switcher */}
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <div className="px-1.5 text-slate-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                    language === lang.code
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={i18n.header.langSelect}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {t('header.badgeDoc', {
                  pages: params.totalPages,
                  tokens: formatTokens(totalDocTokens),
                })}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {t('header.badgeCache', {
                  discount: (params.cacheDiscountRate * 100).toFixed(0),
                  pay: ((1 - params.cacheDiscountRate) * 100).toFixed(0),
                })}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
              <span>{t('header.badgeQuestions', { count: result.totalQuestions })}</span>
            </div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-xs font-medium text-slate-700 transition cursor-pointer"
              title={i18n.header.resetTitle}
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>{i18n.common.reset}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
