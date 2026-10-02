import { Fragment } from "react"
import { ArrowRight, Check, Minus, X } from "lucide-react"

import { LogoMark } from "@/components/layout/logo"
import { Section, SectionHeading } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { COMMON, COMPARE, type Mark, type Provider } from "@/content/site"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Table layout adapted from the 21st.dev "comparison-3" block: grouped rows, our column highlighted,
// a call to action under it. Plans became providers; the marks keep the site's three states.

const TINT: Record<Provider["tint"], string> = {
  // the brand mark brings its own pink tile
  brand: "",
  pink: "bg-pastel-pink text-ink",
  blue: "bg-pastel-blue text-ink",
  green: "bg-pastel-green text-ink",
}

/** Our column, tinted top to bottom. */
const OURS = "bg-brand-soft/60"

function MarkIcon({ mark, ours = false }: { mark: Mark; ours?: boolean }) {
  const { t } = useI18n()
  const Icon = { yes: Check, part: Minus, no: X }[mark]
  return (
    <span
      className={cn(
        "mx-auto grid size-6 place-items-center rounded-full",
        mark === "yes" && (ours ? "bg-brand text-brand-foreground" : "bg-ink text-background"),
        mark === "part" && "bg-muted text-ink ring-1 ring-border",
        mark === "no" && "text-muted-foreground/60"
      )}
    >
      <Icon className="size-3.5" strokeWidth={3} aria-hidden />
      <span className="sr-only">{t(COMPARE.legend[mark])}</span>
    </span>
  )
}

export function Compare() {
  const { t } = useI18n()
  const columns = COMPARE.providers.length + 1

  return (
    <Section id="compare">
      <SectionHeading kicker={t(COMPARE.kicker)} title={t(COMPARE.title)} subtitle={t(COMPARE.subtitle)} />

      <BlurFade inView delay={0.1} className="mx-auto mt-12 max-w-5xl">
        {/* outlined with a hard shadow like the CTA block, so the white table doesn't melt into the white section */}
        <div className="overflow-hidden rounded-3xl border-2 border-ink bg-card text-card-foreground shadow-[5px_7px_0_0_var(--shadow-hard)]">
          {/* phones scroll sideways; the feature column stays pinned */}
          <Table className="min-w-[40rem] table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="sticky left-0 z-10 w-44 bg-card px-4 py-4 align-bottom whitespace-normal sm:w-[36%] sm:px-6">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {t(COMPARE.capability)}
                  </span>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-normal text-muted-foreground">
                    {(["yes", "part", "no"] as const).map((m) => (
                      <li key={m} className="flex items-center gap-1.5" aria-hidden>
                        <span className="[&>span]:size-5">
                          <MarkIcon mark={m} />
                        </span>
                        {t(COMPARE.legend[m])}
                      </li>
                    ))}
                  </ul>
                </TableHead>
                {COMPARE.providers.map((p) => (
                  <TableHead key={p.logo} className={cn("px-2 py-4 text-center align-bottom whitespace-normal", p.us && OURS)}>
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={cn(
                          "grid size-10 place-items-center overflow-hidden rounded-xl font-heading text-xs font-extrabold",
                          TINT[p.tint]
                        )}
                      >
                        {p.us ? <LogoMark className="size-full" /> : p.logo}
                      </span>
                      <span className="text-xs leading-tight font-semibold text-ink">{t(p.name)}</span>
                      {p.us ? (
                        <Badge className="bg-brand text-brand-foreground">{t(p.tagline)}</Badge>
                      ) : (
                        <span className="text-[11px] leading-tight font-normal text-muted-foreground">{t(p.tagline)}</span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {COMPARE.groups.map((group) => (
                <Fragment key={group.title.en}>
                  <TableRow className="bg-muted/60 hover:bg-muted/60">
                    <TableCell colSpan={columns} className="px-4 py-2 sm:px-6">
                      <span className="sticky left-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:left-6">
                        {t(group.title)}
                      </span>
                    </TableCell>
                  </TableRow>
                  {group.rows.map((row) => (
                    <TableRow key={row.feature.en} className="hover:bg-transparent">
                      <TableCell className="sticky left-0 z-10 bg-card px-4 py-3.5 whitespace-normal sm:px-6">
                        <span className="text-sm font-medium text-ink sm:text-[15px]">{t(row.feature)}</span>
                        <span className="mt-1 hidden text-[13px] leading-snug text-muted-foreground sm:block">
                          {t(row.detail)}
                        </span>
                      </TableCell>
                      {row.marks.map((m, i) => {
                        const ours = COMPARE.providers[i].us
                        return (
                          <TableCell key={COMPARE.providers[i].logo} className={cn("px-2 text-center", ours && OURS)}>
                            <MarkIcon mark={m} ours={ours} />
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </Fragment>
              ))}

              <TableRow className="hover:bg-transparent">
                <TableCell className="sticky left-0 z-10 bg-card" />
                {COMPARE.providers.map((p) => (
                  <TableCell key={p.logo} className={cn("px-2 py-4 text-center", p.us && OURS)}>
                    {p.us && (
                      <Button asChild variant="brand" size="sm" className="w-full px-2 font-semibold sm:px-3">
                        <a href="#pricing">
                          {t(COMMON.getStarted)}
                          {/* the phone column is too narrow for the arrow */}
                          <ArrowRight data-icon="inline-end" className="max-sm:hidden" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </Section>
  )
}
