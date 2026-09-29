import { Segmented } from "@/components/layout/segmented"
import { COMMON } from "@/content/site"
import { useI18n, type Lang } from "@/lib/i18n"

const LANGS: Lang[] = ["ru", "en"]

export function LangSwitch({ size, className }: { size?: "sm" | "lg"; className?: string }) {
  const { lang, setLang, t } = useI18n()
  return (
    <Segmented
      label={t(COMMON.language)}
      value={lang}
      options={LANGS.map((l) => ({ value: l, content: l.toUpperCase() }))}
      onChange={setLang}
      size={size}
      className={className}
    />
  )
}
