import { useRef, useState } from "react"
import NumberFlow from "@number-flow/react"
import { Check, Gift, Star } from "lucide-react"
import { motion } from "motion/react"

import { Section, SectionHeading } from "@/components/layout/section"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PRICING, type Period, type Tier } from "@/content/site"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// canvas-confetti only understands hex: --brand (light/dark), a lighter pink, and the compare-mark greens/ambers.
const CONFETTI_COLORS = ["#cf2677", "#e14589", "#f596b7", "#34d399", "#fcd34d"]

/** Confetti burst from an element — fired when the user picks a bigger discount. */
function celebrate(from: Element) {
  const rect = from.getBoundingClientRect()
  // loaded on demand: most visitors never switch the period
  void import("canvas-confetti").then(({ default: confetti }) =>
    confetti({
      particleCount: 50,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: CONFETTI_COLORS,
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["circle"],
      disableForReducedMotion: true,
    })
  )
}

const discount = (period: Period) => PRICING.periods.find((p) => p.months === period)?.save ?? 0

function PriceCard({ tier, period }: { tier: Tier; period: Period }) {
  const { t, locale, formatNumber } = useI18n()
  const total = tier.prices[period]
  const perMonth = Math.round(total / period)
  const undiscounted = tier.prices[1] * period
  const periodLabel = PRICING.periods.find((p) => p.months === period)!.label

  return (
    <Card
      className={cn(
        "relative h-full gap-0 rounded-3xl p-7 text-center sm:p-8",
        tier.featured && "shadow-2xl shadow-brand/15 ring-2 ring-brand"
      )}
    >
      {tier.featured && (
        <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-2xl bg-brand py-1 pr-4 pl-3 text-xs font-semibold text-brand-foreground">
          <Star className="size-3.5 fill-current" aria-hidden />
          {t(PRICING.popular)}
        </div>
      )}

      <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{t(tier.name)}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(PRICING.devicesFor)}{" "}
        <b className="font-semibold text-ink">
          {tier.devices[0]}–{tier.devices[1]}
        </b>{" "}
        {t(PRICING.devices)}
      </p>

      <div className="mt-6 flex items-baseline justify-center gap-x-2">
        <NumberFlow
          value={perMonth}
          locales={locale}
          suffix={` ${PRICING.currency}`}
          transformTiming={{ duration: 500, easing: "ease-out" }}
          className="font-heading text-5xl font-extrabold tracking-tight text-ink tabular-nums"
        />
        <span className="text-sm font-semibold tracking-wide text-muted-foreground">{t(PRICING.perMonth)}</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {period === 1 ? (
          t(PRICING.billedMonthly)
        ) : (
          <>
            <s className="mr-1.5">
              {formatNumber(undiscounted)} {PRICING.currency}
            </s>
            {formatNumber(total)} {PRICING.currency} {t(PRICING.billedFor)} {t(periodLabel)}
          </>
        )}
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3 text-left">
        {tier.features.map((f) => (
          <li key={f.en} className="flex items-start gap-3 text-[15px] text-ink">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
            </span>
            {t(f)}
          </li>
        ))}
      </ul>

      <hr className="my-7" />

      <Button
        asChild
        size="xl"
        variant={tier.featured ? "brand" : "outline"}
        className="w-full font-semibold ring-offset-2 ring-offset-card duration-300 hover:bg-brand hover:text-brand-foreground hover:ring-2 hover:ring-brand"
      >
        <a href="#contact">{t(tier.cta)}</a>
      </Button>
      {tier.trial && (
        <p className="mt-4 flex items-start gap-2 text-left text-sm text-muted-foreground">
          <Gift className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
          {t(tier.trial)}
        </p>
      )}
      {tier.description && <p className="mt-4 text-sm text-muted-foreground">{t(tier.description)}</p>}
    </Card>
  )
}

export function Pricing() {
  const { t } = useI18n()
  const [period, setPeriod] = useState<Period>(1)
  const tabsRef = useRef<HTMLDivElement>(null)
  // three columns (and the fanned-out layout) only from lg — narrower cards can't fit the copy
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const changePeriod = (value: string) => {
    const next = Number(value) as Period
    if (discount(next) > discount(period)) {
      const tab = tabsRef.current?.querySelector(`[data-period="${next}"]`)
      if (tab) celebrate(tab)
    }
    setPeriod(next)
  }

  return (
    <Section id="pricing" tone="muted">
      <SectionHeading kicker={t(PRICING.kicker)} title={t(PRICING.title)} subtitle={t(PRICING.subtitle)} />

      <BlurFade inView className="mt-10 flex justify-center">
        <Tabs value={String(period)} onValueChange={changePeriod} className="w-full max-w-md sm:w-auto sm:max-w-none">
          <TabsList
            ref={tabsRef}
            aria-label={t(PRICING.periodLabel)}
            className="grid w-full grid-cols-3 items-stretch gap-1 rounded-3xl bg-background p-1 ring-1 ring-border group-data-horizontal/tabs:h-auto sm:flex sm:w-fit sm:rounded-full sm:p-1.5"
          >
            {PRICING.periods.map((p) => (
              // `!` beats the shadcn trigger's own hover/dark styles, which would recolor the active pill
              <TabsTrigger
                key={p.months}
                value={String(p.months)}
                data-period={p.months}
                className="h-auto flex-col gap-1 rounded-[1.25rem] px-1.5 py-2 sm:h-10 sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-4 sm:py-0 data-active:border-transparent! data-active:bg-ink! data-active:text-background!"
              >
                {t(p.label)}
                {p.save > 0 && (
                  <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold text-brand">
                    −{p.save}%
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </BlurFade>

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-4">
        {PRICING.tiers.map((tier, index) => {
          const side = index === 0 ? 1 : index === 2 ? -1 : 0
          return (
            <motion.div
              key={tier.id}
              initial={{ y: 50, opacity: 0 }}
              // desktop: the featured plan rises, the side plans lean in behind it
              whileInView={
                isDesktop
                  ? { y: tier.featured ? -20 : 0, x: side * 30, scale: side ? 0.94 : 1, opacity: 1 }
                  : { y: 0, opacity: 1 }
              }
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 30, delay: 0.4, opacity: { duration: 0.5 } }}
              className={cn(
                tier.featured ? "z-10" : "z-0 lg:mt-5",
                index === 0 && "origin-right",
                index === 2 && "origin-left"
              )}
            >
              <PriceCard tier={tier} period={period} />
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
