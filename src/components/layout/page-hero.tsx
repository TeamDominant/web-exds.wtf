import type { ReactNode } from "react"

import { Container, Kicker } from "@/components/layout/section"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

/** Title block for inner pages (FAQ, legal). */
export function PageHero({
  kicker,
  title,
  subtitle,
  aside,
}: {
  kicker: ReactNode
  title: ReactNode
  subtitle: ReactNode
  aside?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--border)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className={cn("relative grid items-center gap-10 py-14 sm:py-20", aside && "md:grid-cols-[1.4fr_1fr]")}>
        <BlurFade className="flex flex-col items-start gap-4">
          <Kicker>{kicker}</Kicker>
          {/* long Russian words ("конфиденциальность") don't fit a phone line at 4xl */}
          <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight hyphens-auto break-words sm:text-5xl">{title}</h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
        </BlurFade>
        {aside && (
          // not a <BlurFade>: the aside is an <Illustration>, which fades itself in
          <div className="mx-auto hidden w-full max-w-xs md:block">{aside}</div>
        )}
      </Container>
    </section>
  )
}
