import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { useMediaQuery } from "@/hooks/use-media-query"

export type Theme = "system" | "light" | "dark"
export type ResolvedTheme = "light" | "dark"

// Keep in sync with the pre-paint script in vite.config.ts.
const STORAGE_KEY = "td-theme"
const THEME_COLOR: Record<ResolvedTheme, string> = { light: "#ffffff", dark: "#181715" }

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "light" || stored === "dark" ? stored : "system"
  } catch {
    return "system"
  }
}

/** Swaps the palette in one frame — otherwise every `transition-colors` element fades on its own schedule. */
function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  const pause = document.createElement("style")
  pause.textContent = "*,*::before,*::after{transition:none!important}"
  document.head.append(pause)

  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[resolved])

  // Force a style flush with transitions off, then restore them.
  void getComputedStyle(root).color
  requestAnimationFrame(() => pause.remove())
}

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const resolvedTheme: ResolvedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage can be unavailable (private mode) — the choice just won't persist
    }
  }, [])

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
  return ctx
}
