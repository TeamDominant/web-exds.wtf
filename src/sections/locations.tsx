import { useCallback, useEffect, useRef, useState } from "react"
import NumberFlow from "@number-flow/react"
import type { COBEOptions } from "cobe"
import { useInView, useReducedMotion } from "motion/react"

import { Section, SectionHeading } from "@/components/layout/section"
import { LiveAreaChart } from "@/components/live-area-chart"
import { BlurFade } from "@/components/ui/blur-fade"
import { Globe } from "@/components/ui/globe"
import { LOCATIONS } from "@/content/site"
import { useI18n } from "@/lib/i18n"
import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

const SERVERS = LOCATIONS.servers

// Must stay referentially stable — <Globe> re-creates the WebGL scene when config changes.
const GLOBE_LIGHT: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 0,
  diffuse: 0.5,
  mapSamples: 16000,
  mapBrightness: 1.4,
  baseColor: [1, 1, 1],
  markerColor: [0.83, 0.11, 0.45],
  glowColor: [0.99, 0.95, 0.97],
  // small enough that the European servers, a few degrees apart, stay separate dots
  markers: SERVERS.map((s) => ({ location: s.location, size: 0.035 })),
}

const GLOBE_DARK: COBEOptions = {
  ...GLOBE_LIGHT,
  dark: 1,
  diffuse: 1.2,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [0.93, 0.3, 0.55],
  glowColor: [0.2, 0.19, 0.18],
}

function FlagChip({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl border bg-surface font-mono text-xs font-semibold text-ink",
        className
      )}
    >
      {code}
    </span>
  )
}

function ServerPanel({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const { t, locale } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduce = useReducedMotion()
  const server = SERVERS[active]
  // the live chart reports the sample at its right edge; the headline number follows it
  const [speed, setSpeed] = useState(server.speed)
  const [ping, setPing] = useState(server.ping)

  // each new sample also nudges the ping a little around the server's typical value
  const onSample = useCallback(
    (value: number) => {
      setSpeed(value)
      setPing(Math.max(1, Math.round(server.ping * (0.94 + Math.random() * 0.14))))
    },
    [server.ping]
  )

  // Auto-cycle servers slowly enough for the chart to settle on each one's level;
  // a manual pick restarts the countdown because `active` changes.
  useEffect(() => {
    if (!inView || reduce) return
    const id = setTimeout(() => onSelect((active + 1) % SERVERS.length), 10_000)
    return () => clearTimeout(id)
  }, [active, inView, reduce, onSelect])

  return (
    <div ref={ref} className="rounded-3xl border bg-background p-4 shadow-xl shadow-ink/5 sm:p-5">
      <h3 className="px-1 text-base font-bold">{t(LOCATIONS.panel.title)}</h3>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-surface p-4">
        <div className="flex min-w-0 items-center gap-3">
          <FlagChip code={server.flag} className="bg-background" />
          <div className="min-w-0">
            <div className="truncate font-semibold text-ink">{t(server.city)}</div>
            <div className="truncate font-mono text-xs text-muted-foreground">
              {server.host} · {ping} ms
            </div>
          </div>
        </div>
        <div className="text-right">
          <NumberFlow
            value={Math.round(speed * 10) / 10}
            locales={locale}
            format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            className="font-heading text-2xl font-extrabold text-ink tabular-nums"
          />
          <div className="text-xs text-muted-foreground">{t(LOCATIONS.panel.down)}</div>
        </div>
      </div>

      <LiveAreaChart target={server.speed} spread={0.2} min={1} max={2.5} onValue={onSample} className="mt-4 h-20" />

      <div className="mt-5 px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {t(LOCATIONS.panel.fastest)}
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {SERVERS.map((s, i) => (
          <li key={s.host}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => onSelect(i)}
              className={cn(
                "grid w-full grid-cols-[auto_1fr_4rem_3.5rem] items-center gap-3 rounded-2xl border border-transparent p-2 text-left transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                i === active && "border-brand/30 bg-brand-soft hover:bg-brand-soft"
              )}
            >
              <FlagChip code={s.flag} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{t(s.city)}</span>
                <span className="block truncate font-mono text-xs text-muted-foreground">{s.host}</span>
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="block h-full rounded-full bg-ink/70" style={{ width: `${s.load}%` }} />
              </span>
              <span className="text-right font-mono text-xs text-muted-foreground">
                <b className="font-semibold text-ink">{s.ping}</b> ms
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Locations() {
  const { t } = useI18n()
  const { resolvedTheme } = useTheme()
  const [active, setActive] = useState(0)
  const server = SERVERS[active]
  return (
    <Section id="locations" tone="muted" className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <SectionHeading
            align="left"
            kicker={t(LOCATIONS.kicker)}
            title={t(LOCATIONS.title)}
            subtitle={t(LOCATIONS.subtitle)}
          />
          <BlurFade inView delay={0.1}>
            <ServerPanel active={active} onSelect={setActive} />
          </BlurFade>
        </div>
        <BlurFade inView delay={0.15} className="relative mx-auto aspect-square w-full max-w-[560px]">
          <Globe
            config={resolvedTheme === "dark" ? GLOBE_DARK : GLOBE_LIGHT}
            focus={server.location}
            label={
              <span className="flex flex-col items-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-background px-2.5 py-1 text-xs font-bold whitespace-nowrap text-ink shadow-[2px_3px_0_0_var(--shadow-hard)]">
                  <span className="font-mono text-[10px] text-muted-foreground">{server.flag}</span>
                  {t(server.city)}
                </span>
                <span className="h-3 w-0.5 bg-ink" />
                {/* glowing dot centred on the location (-mb-1 = half its height) */}
                <span className="relative -mb-1 flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand ring-2 ring-background" />
                </span>
              </span>
            }
            className="max-w-none"
          />
        </BlurFade>
      </div>
    </Section>
  )
}
