import { StrictMode, useEffect, type ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { MotionConfig } from "motion/react"

import { BackToTop } from "@/components/layout/back-to-top"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { I18nProvider } from "@/lib/i18n"
import { ThemeProvider } from "@/lib/theme"
import "@/index.css"

function PageShell({ children }: { children: ReactNode }) {
  // The browser tries to jump to a #anchor before React has rendered the page, so repeat it once mounted.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" })
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <BackToTop />
      </div>
    </MotionConfig>
  )
}

/** Entry point shared by every HTML page of the multi-page build. */
export function mountPage(page: ReactNode) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <I18nProvider>
          <PageShell>{page}</PageShell>
        </I18nProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
