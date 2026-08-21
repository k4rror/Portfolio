import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import content from "./content.json";

export type Lang = keyof typeof content;
export type Content = (typeof content)[Lang];

const LANG_KEY = "portfolio_lang";
const LANGS = Object.keys(content) as Lang[];

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && (LANGS as string[]).includes(stored)) return stored as Lang;
  } catch {
    // localStorage unavailable (privacy mode) — fall through to default
  }
  return LANGS[0];
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  // Keep <html lang> in sync for screen readers and search engines
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLangPersisted = useCallback((next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // ignore persistence errors
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang: setLangPersisted }),
    [lang, setLangPersisted]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useContent(): Content {
  return content[useLanguage().lang];
}
