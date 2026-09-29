import type { ReactNode } from "react"

import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
}

const TONES = {
  default: "bg-background",
  muted: "bg-surface",
  ink: "bg-contrast text-white",
} as const

export function Section({
  id,
  tone = "default",
  className,
  children,
}: {
  id?: string
  tone?: keyof typeof TONES
  className?: string
  children: ReactNode
}) {
  return (
    // Negative scroll margin = top padding minus 2rem: an anchor jump tucks the section edge under the
    // header and leaves the heading 2rem below it instead of behind a full padding's worth of space.
    <section id={id} className={cn("-scroll-mt-12 py-20 sm:-scroll-mt-20 sm:py-28", TONES[tone], className)}>
      <Container>{children}</Container>
    </section>
  )
}

/** Small uppercase eyebrow above a heading. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-xs font-bold tracking-wider text-brand uppercase sm:text-sm", className)}>{children}</span>
  )
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  inverted = false,
  className,
}: {
  kicker?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  align?: "center" | "left"
  inverted?: boolean
  className?: string
}) {
  return (
    <BlurFade
      inView
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className
      )}
    >
      {kicker && (
        <Kicker className={cn(inverted && "text-white/60")}>{kicker}</Kicker>
      )}
      <h2
        className={cn(
          "text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          inverted && "text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-base sm:text-lg", inverted ? "text-white/70" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </BlurFade>
  )
}
