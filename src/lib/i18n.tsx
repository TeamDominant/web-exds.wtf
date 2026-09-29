import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Lang = "ru" | "en"

/** A piece of copy in every supported language. */
export type Text = Record<Lang, string>

const STORAGE_KEY = "td-lang"

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "en" ? "en" : "ru"
  } catch {
    return "ru"
  }
}

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage can be unavailable (private mode) — the choice just won't persist
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>")
  const { lang, setLang } = ctx
  // A no-break space before a dash keeps "–" from starting a line (Russian typography rule).
  const t = useCallback((text: Text) => text[lang].replaceAll(" – ", "\u00a0– "), [lang])
  const locale = lang === "en" ? "en-US" : "ru-RU"
  const formatNumber = useCallback(
    (n: number) => n.toLocaleString(locale),
    [locale]
  )
  return { lang, setLang, t, locale, formatNumber }
}

/** Keeps the document title / description in sync with the active language. */
export function useDocumentMeta(title: Text, description: Text) {
  const { t } = useI18n()
  useEffect(() => {
    document.title = t(title)
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t(description))
  }, [t, title, description])
}
