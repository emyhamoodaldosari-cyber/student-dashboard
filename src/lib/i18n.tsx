import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ar, en, type MessageKey } from "./i18n-dict";

export type Locale = "en" | "ar";
export type Localized = { en: string; ar: string };

const STORAGE_KEY = "beacon.locale";
const dictionaries: Record<Locale, Record<MessageKey, string>> = { en, ar };

/** Intl locale per app locale — Arabic uses Gregorian calendar and Latin digits. */
const intlLocale: Record<Locale, string> = { en: "en-US", ar: "ar-SA-u-ca-gregory-nu-latn" };

export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  let s = dictionaries[locale][key] ?? en[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  l: (value: Localized) => string;
  formatDate: (iso: string, withTime?: boolean) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ar" || saved === "en") setLocaleState(saved);
  }, []);

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
      l: (v) => v[locale],
      formatDate: (iso, withTime = false) => {
        const d = new Date(iso);
        const date = d.toLocaleDateString(intlLocale[locale], { month: "short", day: "numeric", year: "numeric" });
        if (!withTime) return date;
        const time = d.toLocaleTimeString(intlLocale[locale], { hour: "numeric", minute: "2-digit" });
        return `${date}، ${time}`.replace("، ", locale === "ar" ? "، " : ", ");
      },
    }),
    [locale, dir, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>
      <DirectionProvider dir={dir}>{children}</DirectionProvider>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
