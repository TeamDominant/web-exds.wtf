import { Illustration, type IllustrationSlot } from "@/components/illustration"
import { Section, SectionHeading } from "@/components/layout/section"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card } from "@/components/ui/card"
import { STEPS } from "@/content/site"
import { useI18n } from "@/lib/i18n"

const SLOTS: IllustrationSlot[] = ["step-1", "step-2", "step-3"]

export function HowItWorks() {
  const { t } = useI18n()
  return (
    <Section id="how">
      <SectionHeading kicker={t(STEPS.kicker)} title={t(STEPS.title)} />
      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {STEPS.items.map((step, i) => (
          <BlurFade key={step.title.en} inView delay={i * 0.1} className="h-full">
            <li className="h-full">
              <Card className="h-full gap-6 rounded-3xl p-6 sm:p-7">
                <Illustration slot={SLOTS[i]} />
                <div className="flex flex-col gap-2">
                  <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-background font-heading text-sm font-extrabold text-ink shadow-[2px_3px_0_0_var(--shadow-hard)]">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{t(step.title)}</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{t(step.text)}</p>
                </div>
              </Card>
            </li>
          </BlurFade>
        ))}
      </ol>
    </Section>
  )
}
