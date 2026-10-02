import { ArrowRight } from "lucide-react"

import { Illustration } from "@/components/illustration"
import { Section, SectionHeading } from "@/components/layout/section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { FAQ, type FaqItem } from "@/content/site"
import { useI18n } from "@/lib/i18n"

export function FaqList({ items }: { items: FaqItem[] }) {
  const { t } = useI18n()
  return (
    <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-3xl bg-background">
      {items.map((item, i) => (
        <AccordionItem key={item.q.en} value={`faq-${i}`} className="data-open:bg-surface">
          <AccordionTrigger className="px-5 py-5 text-base font-semibold text-ink hover:no-underline sm:px-6">
            {t(item.q)}
          </AccordionTrigger>
          <AccordionContent className="px-1 text-[15px] leading-relaxed text-muted-foreground sm:px-2">
            {t(item.a)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/** Landing-page FAQ: the first questions plus a link to the full list. */
export function Faq() {
  const { t } = useI18n()
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading align="left" kicker="FAQ" title={t(FAQ.title)} subtitle={t(FAQ.subtitle)} />
          <BlurFade inView delay={0.1}>
            <Button asChild variant="outline" size="lg" className="w-fit">
              <a href="/faq.html">
                {t(FAQ.all)}
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
          </BlurFade>
          {/* outside the <BlurFade>: the illustration fades itself in */}
          <Illustration slot="faq" className="hidden max-w-sm lg:block" />
        </div>
        <BlurFade inView delay={0.1}>
          <FaqList items={FAQ.items} />
        </BlurFade>
      </div>
    </Section>
  )
}
