import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  i18n: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'llm_cost_comparator_lang';

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh' || saved === 'ja') {
      return saved;
    }
  } catch {
    // ignore
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('ja')) return 'ja';
  }

  return 'en';
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  }, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = translations.en;
        for (const fKey of keys) {
          if (fallback && typeof fallback === 'object' && fKey in fallback) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return path;
    }

    if (!params) return current;

    return current.replace(/\{(\w+)\}/g, (_, key) => {
      return params[key] !== undefined ? String(params[key]) : `{${key}}`;
    });
  };

  const currentTranslations = translations[language] || translations.en;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, i18n: currentTranslations }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
