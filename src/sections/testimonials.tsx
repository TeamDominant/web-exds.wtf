import { useLayoutEffect, useRef, useState } from "react"
import { Quote } from "lucide-react"

import { Container, SectionHeading } from "@/components/layout/section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee"
import { TESTIMONIALS, TESTIMONIALS_META, type Testimonial } from "@/content/testimonials"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Placeholders are a dev-only preview — never ship invented reviews.
const ITEMS = import.meta.env.DEV ? TESTIMONIALS : TESTIMONIALS.filter((item) => !item.placeholder)

const AVATAR_TINTS = ["bg-pastel-yellow", "bg-pastel-blue", "bg-pastel-green", "bg-pastel-pink", "bg-pastel-purple", "bg-pastel-orange"]

/** "Клиент №7" → "7"; otherwise the name's initials. */
const avatarText = (name: string) =>
  name.match(/\d+/)?.[0] ??
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

function TestimonialCard({ item, index }: { item: Testimonial; index: number }) {
  const { t } = useI18n()
  const text = t(item.text)
  const name = t(item.name)
  // one-liners read as a big quote; a very long review gets a wider card instead of a very tall one
  const short = text.length < 90
  const long = text.length > 400

  // Phones clamp long reviews to a few lines; the toggle appears only when the text really overflows.
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const body = (
    <Card
      className={cn(
        "h-full w-[300px] gap-5 rounded-3xl p-6 transition-shadow hover:shadow-lg hover:shadow-ink/5 sm:w-[340px]",
        long && "sm:w-[560px]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Quote className="size-6 fill-brand-soft text-brand" aria-hidden />
        {item.placeholder && (
          <Badge variant="outline" className="border-dashed text-muted-foreground">
            {t(TESTIMONIALS_META.placeholderBadge)}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col items-start gap-2">
        <p
          ref={textRef}
          className={cn(
            "text-ink",
            short ? "font-heading text-xl leading-snug font-semibold" : "text-[15px] leading-relaxed",
            !expanded && "max-sm:line-clamp-6"
          )}
        >
          {text}
        </p>
        {(overflows || expanded) && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md text-sm font-semibold text-brand underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {t(expanded ? TESTIMONIALS_META.less : TESTIMONIALS_META.more)}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="border-2 border-ink after:hidden">
          {item.avatar && <AvatarImage src={item.avatar} alt="" />}
          <AvatarFallback
            className={cn("font-heading text-xs font-bold text-ink", AVATAR_TINTS[index % AVATAR_TINTS.length])}
          >
            {avatarText(name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">{name}</div>
          {item.handle && <div className="truncate text-xs text-muted-foreground">{item.handle}</div>}
        </div>
      </div>
    </Card>
  )

  return item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer" className="block h-full rounded-3xl">
      {body}
    </a>
  ) : (
    body
  )
}

export function Testimonials() {
  const { t } = useI18n()
  if (ITEMS.length === 0) return null

  // Split into two rows moving in opposite directions once there are enough reviews.
  const rows = ITEMS.length >= 6 ? [ITEMS.filter((_, i) => i % 2 === 0), ITEMS.filter((_, i) => i % 2 === 1)] : [ITEMS]

  return (
    <section id="reviews" className="overflow-hidden py-20 sm:py-28">
      <Container>
        <SectionHeading
          kicker={t(TESTIMONIALS_META.kicker)}
          title={t(TESTIMONIALS_META.title)}
          subtitle={t(TESTIMONIALS_META.subtitle)}
        />
      </Container>
      {/* full-bleed rows */}
      <BlurFade inView delay={0.1} className="relative mt-14 flex flex-col gap-2">
        {rows.map((row, r) => (
          <Marquee key={r} pauseOnHover reverse={r === 1} className="py-2 [--duration:55s] [--gap:1.25rem]">
            {row.map((item) => {
              const index = ITEMS.indexOf(item)
              return <TestimonialCard key={index} item={item} index={index} />
            })}
          </Marquee>
        ))}
        {/* soft fade at the edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background sm:w-40" />
      </BlurFade>
    </section>
  )
}
