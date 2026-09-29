import { Check, Minus, X } from "lucide-react"

import { LogoMark } from "@/components/layout/logo"
import { Section, SectionHeading } from "@/components/layout/section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BlurFade } from "@/components/ui/blur-fade"
import { COMPARE, type Mark, type Provider } from "@/content/site"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const MARK_STYLE: Record<Mark, { icon: typeof Check; className: string }> = {
  yes: { icon: Check, className: "bg-emerald-400 text-emerald-950" },
  part: { icon: Minus, className: "bg-amber-300 text-amber-950" },
  no: { icon: X, className: "bg-white/10 text-white/50" },
}

const TINT: Record<Provider["tint"], string> = {
  // the brand mark brings its own black tile; the ring separates it from the dark section
  brand: "ring-1 ring-white/20",
  pink: "bg-pastel-pink text-ink",
  blue: "bg-pastel-blue text-ink",
  green: "bg-pastel-green text-ink",
}

function MarkIcon({ mark }: { mark: Mark }) {
  const { t } = useI18n()
  const { icon: Icon, className } = MARK_STYLE[mark]
  return (
    <span className={cn("grid size-6 place-items-center rounded-full sm:size-7", className)}>
      <Icon className="size-3.5 sm:size-4" strokeWidth={3} aria-hidden />
      <span className="sr-only">{t(COMPARE.legend[mark])}</span>
    </span>
  )
}

// Mobile: the feature text spans a full row and the 4 provider marks sit below it.
// sm+: one row — feature | 4 providers. The trailing 1rem column holds the accordion chevron.
const GRID =
  "grid grid-cols-[repeat(4,minmax(0,1fr))_1rem] items-center gap-x-2 gap-y-3 sm:grid-cols-[minmax(0,1fr)_repeat(4,6.5rem)_1rem] sm:gap-x-3"
const FEATURE_CELL = "col-span-5 sm:col-span-1"

export function Compare() {
  const { t } = useI18n()
  const marks: Mark[] = ["yes", "part", "no"]

  return (
    <Section id="compare" tone="ink">
      <SectionHeading inverted kicker={t(COMPARE.kicker)} title={t(COMPARE.title)} subtitle={t(COMPARE.subtitle)} />

      <BlurFade inView className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-white/70">
        {marks.map((m) => (
          <span key={m} className="inline-flex items-center gap-2">
            <MarkIcon mark={m} />
            <span aria-hidden>{t(COMPARE.legend[m])}</span>
          </span>
        ))}
      </BlurFade>

      <BlurFade inView delay={0.1} className="mx-auto mt-10 max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-2 sm:p-3">
          {/* header */}
          <div className={cn(GRID, "items-start px-4 pt-3 pb-4")}>
            <span className="hidden self-center text-xs font-semibold tracking-wider text-white/50 uppercase sm:block">
              {t(COMPARE.capability)}
            </span>
            {COMPARE.providers.map((p) => (
              <div key={p.logo} className="flex flex-col items-center gap-1.5 text-center">
                <span
                  className={cn(
                    "grid size-9 place-items-center overflow-hidden rounded-xl font-heading text-xs font-extrabold sm:size-10",
                    TINT[p.tint]
                  )}
                  title={t(p.name)}
                >
                  {p.us ? <LogoMark className="size-full" /> : p.logo}
                </span>
                <span className="hidden text-xs leading-tight font-semibold text-white sm:block">{t(p.name)}</span>
                <span className="hidden text-[11px] leading-tight text-white/50 sm:block">{t(p.tagline)}</span>
              </div>
            ))}
            <span />
          </div>

          <Accordion type="multiple" defaultValue={["row-0"]} className="rounded-2xl border-white/10">
            {COMPARE.rows.map((row, i) => (
              <AccordionItem
                key={row.feature.en}
                value={`row-${i}`}
                className="border-white/10 data-open:bg-white/[0.04]"
              >
                <AccordionTrigger
                  className={cn(
                    GRID,
                    "px-4 py-4 text-white hover:no-underline **:data-[slot=accordion-trigger-icon]:text-white/50"
                  )}
                >
                  <span className={cn(FEATURE_CELL, "text-sm font-medium sm:text-[15px]")}>{t(row.feature)}</span>
                  {row.marks.map((m, j) => (
                    <span key={j} className="flex justify-center">
                      <MarkIcon mark={m} />
                    </span>
                  ))}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl text-white/70">{t(row.detail)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </BlurFade>
    </Section>
  )
}
