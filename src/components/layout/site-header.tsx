import { useEffect, useRef, useState } from "react"
import { ArrowRight, Menu } from "lucide-react"

import { LangSwitch } from "@/components/layout/lang-switch"
import { Logo } from "@/components/layout/logo"
import { ThemeSwitch } from "@/components/layout/theme-switch"
import { Container } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { COMMON, NAV_LINKS } from "@/content/site"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])
  return scrolled
}

/** Marks page links (faq.html, legal.html) as current; in-page anchors are never "current". */
function isCurrentPage(href: string) {
  return !href.includes("#") && window.location.pathname.endsWith(href)
}

export function SiteHeader() {
  const { t } = useI18n()
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  // Set when the menu closes because a link was followed: focus must then stay put, since returning
  // it to the "Menu" button scrolls the page and cuts the jump to the section short.
  const followingLink = useRef(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-md transition-colors",
        scrolled && "border-border"
      )}
    >
      <Container className="flex h-16 items-center gap-4 xl:gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex xl:ml-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isCurrentPage(link.href) ? "page" : undefined}
              className="rounded-full px-2.5 py-2 text-sm font-medium text-muted-foreground xl:px-3 transition-colors hover:bg-muted hover:text-ink aria-[current=page]:text-ink"
            >
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ThemeSwitch />
          <LangSwitch />
          <Button asChild>
            <a href="/#pricing">{t(COMMON.getStarted)}</a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="ml-auto lg:hidden">
              <Menu data-icon="inline-start" />
              {t(COMMON.menu)}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(22rem,88vw)] gap-0"
            onClickCapture={(e) => {
              if ((e.target as Element).closest("a[href]")) followingLink.current = true
            }}
            onCloseAutoFocus={(e) => {
              if (followingLink.current) e.preventDefault()
              followingLink.current = false
            }}
          >
            <SheetHeader className="border-b">
              <SheetTitle asChild>
                <div>
                  <Logo />
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-3">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-muted"
                  >
                    {t(link.label)}
                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                  </a>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4 border-t p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ThemeSwitch size="lg" />
                <LangSwitch size="lg" />
              </div>
              <SheetClose asChild>
                <Button asChild variant="brand" size="xl" className="w-full">
                  <a href="/#pricing">{t(COMMON.getStarted)}</a>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  )
}
