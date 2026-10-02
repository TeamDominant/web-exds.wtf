import { useEffect, useState } from "react"

import { Illustration } from "@/components/illustration"
import { PageHero } from "@/components/layout/page-hero"
import { Container } from "@/components/layout/section"
import { LEGAL_META, LEGAL_SECTIONS, type LegalBlock } from "@/content/legal"
import { useDocumentMeta, useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/** Highlights the section currently in the upper part of the viewport. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = LEGAL_SECTIONS.map((s) => s.id)

function Block({ block }: { block: LegalBlock }) {
  const { t } = useI18n()
  switch (block.type) {
    case "h3":
      return <h3 className="mt-8 text-lg font-bold">{t(block.text)}</h3>
    case "p":
      return <p className="mt-3 leading-relaxed text-ink/80">{t(block.text)}</p>
    case "ul":
      return (
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink/80 marker:text-brand">
          {block.items.map((item) => (
            <li key={item.en}>{t(item)}</li>
          ))}
        </ul>
      )
    case "details":
      return (
        <dl className="mt-6 divide-y rounded-2xl border bg-card">
          {block.rows.map((row) => (
            <div key={row.label.en} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-sm text-muted-foreground">{t(row.label)}</dt>
              <dd className="leading-relaxed text-ink">
                {row.href ? (
                  <a href={row.href} className="font-medium text-brand underline-offset-4 hover:underline">
                    {t(row.value)}
                  </a>
                ) : (
                  t(row.value)
                )}
              </dd>
            </div>
          ))}
        </dl>
      )
  }
}

export function LegalPage() {
  const { t } = useI18n()
  useDocumentMeta(LEGAL_META.pageTitle, LEGAL_META.description)
  const active = useScrollSpy(SECTION_IDS)

  return (
    <>
      <PageHero
        kicker={t(LEGAL_META.kicker)}
        title={t(LEGAL_META.title)}
        subtitle={t(LEGAL_META.subtitle)}
        aside={<Illustration slot="legal" eager />}
      />
      <Container className="grid grid-cols-1 gap-10 py-14 sm:py-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* mobile: a swipeable row that runs to the screen edges */}
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:px-0">
            {LEGAL_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-ink lg:rounded-xl",
                  active === s.id && "border-ink bg-ink text-background hover:text-background"
                )}
              >
                {t(s.title)}
              </a>
            ))}
          </nav>
        </aside>

        <article className="max-w-3xl">
          {LEGAL_SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className={cn(i > 0 && "mt-16 border-t pt-16")}>
              <h2 className="text-3xl font-extrabold tracking-tight hyphens-auto break-words">{t(s.title)}</h2>
              {s.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}
        </article>
      </Container>
    </>
  )
}
