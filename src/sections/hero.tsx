import { ArrowRight, Check } from "lucide-react"

import { Illustration } from "@/components/illustration"
import { Container } from "@/components/layout/section"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { TextEffect } from "@/components/ui/text-effect"
import { HERO } from "@/content/site"
import { useI18n } from "@/lib/i18n"

/** Hand-drawn underline under the accent word. */
function Scribble() {
  return (
    <svg
      viewBox="0 0 220 18"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute -bottom-2 left-0 h-3 w-full text-brand/70 sm:h-4"
    >
      <path
        d="M3 12 C40 5 90 3 130 6 C160 8 190 9 217 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Hero() {
  const { t, lang } = useI18n()
  const { title } = HERO

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Notion-paper dot grid, faded towards the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--border)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <Container className="relative grid items-center gap-12 pt-10 pb-20 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-start">
          {/* key={lang} replays the entrance when the language switches */}
          <h1
            key={lang}
            className="text-[2.5rem] leading-[1.05] font-extrabold tracking-tight sm:text-6xl lg:text-[3.75rem]"
          >
            <span className="relative inline-block text-brand">
              <TextEffect as="span" per="word" preset="fade-in-blur">
                {t(title.accent)}
              </TextEffect>
              <Scribble />
            </span>{" "}
            <TextEffect as="span" per="word" preset="fade-in-blur" delay={0.15}>
              {t(title.after)}
            </TextEffect>
          </h1>

          <BlurFade delay={0.35}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t(HERO.subtitle)}</p>
          </BlurFade>

          <BlurFade delay={0.45} className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="xl">
              <a href="#pricing">
                {t(HERO.primary)}
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-background">
              <a href="#how">{t(HERO.secondary)}</a>
            </Button>
          </BlurFade>

          <AnimatedGroup preset="blur-slide" as="ul" asChild="li" className="mt-9 flex flex-col gap-3">
            {HERO.checklist.map((item) => (
              <span key={item.en} className="flex items-start gap-3 text-sm text-ink sm:text-base">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {t(item)}
              </span>
            ))}
          </AnimatedGroup>
        </div>

        {/* no <BlurFade> here: the illustration fades itself in (see Illustration) */}
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <Illustration slot="hero" alt={t(HERO.illustrationAlt)} eager />
        </div>
      </Container>
    </section>
  )
}
