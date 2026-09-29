import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { COMMON } from "@/content/site"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/** Floating "back to top" button, shown once the first screen has been scrolled past. */
export function BackToTop() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label={t(COMMON.backToTop)}
      title={t(COMMON.backToTop)}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      // honours `scroll-behavior` on <html>: smooth, or instant with reduced motion
      onClick={() => window.scrollTo({ top: 0 })}
      className={cn(
        "fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border-2 border-ink bg-background text-ink shadow-[2px_3px_0_0_var(--shadow-hard)] transition-[opacity,translate] duration-300 hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:right-6 sm:bottom-6",
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="size-5" strokeWidth={2.25} aria-hidden />
    </button>
  )
}
