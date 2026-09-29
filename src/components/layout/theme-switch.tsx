import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"

import { Segmented } from "@/components/layout/segmented"
import { COMMON } from "@/content/site"
import { useI18n, type Text } from "@/lib/i18n"
import { useTheme, type Theme } from "@/lib/theme"

const THEMES: { value: Theme; icon: LucideIcon; label: Text }[] = [
  { value: "system", icon: Monitor, label: COMMON.themeSystem },
  { value: "light", icon: Sun, label: COMMON.themeLight },
  { value: "dark", icon: Moon, label: COMMON.themeDark },
]

export function ThemeSwitch({ size, className }: { size?: "sm" | "lg"; className?: string }) {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  return (
    <Segmented
      label={t(COMMON.theme)}
      value={theme}
      options={THEMES.map(({ value, icon: Icon, label }) => ({ value, content: <Icon aria-hidden />, label: t(label) }))}
      onChange={setTheme}
      size={size}
      className={className}
    />
  )
}
