import { Logo } from "@/components/layout/logo"
import { Container } from "@/components/layout/section"
import { BRAND, COMMON, FOOTER } from "@/content/site"
import { useI18n } from "@/lib/i18n"

const YEAR = new Date().getFullYear()

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="border-t bg-surface">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex max-w-xs flex-col gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">{t(COMMON.tagline)}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER.columns.map((col) => (
            <div key={col.title.en}>
              <h4 className="text-sm font-bold">{t(col.title)}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-ink">
                      {t(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container>
        <div className="flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            © {YEAR} {BRAND.name}
          </span>
          <span className="sm:max-w-md sm:text-right">{t(COMMON.demo)}</span>
        </div>
      </Container>
    </footer>
  )
}
