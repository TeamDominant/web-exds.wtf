import { ArrowRight, Mail, Send } from "lucide-react"

import { Illustration } from "@/components/illustration"
import { Kicker, Section } from "@/components/layout/section"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { CONTACTS, CTA } from "@/content/site"
import { useI18n } from "@/lib/i18n"

export function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline" className="bg-background">
        <a href={CONTACTS.telegram}>
          <Send data-icon="inline-start" />
          Telegram
        </a>
      </Button>
      <Button asChild variant="outline" className="bg-background">
        <a href={`mailto:${CONTACTS.email}`}>
          <Mail data-icon="inline-start" />
          {CONTACTS.email}
        </a>
      </Button>
    </div>
  )
}

export function Cta() {
  const { t } = useI18n()
  return (
    <Section id="contact" className="scroll-mt-0 pt-4 sm:scroll-mt-0 sm:pt-8">
      <BlurFade inView>
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border-[2.5px] border-ink bg-brand-soft p-8 shadow-[6px_8px_0_0_var(--shadow-hard)] sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col items-start gap-5">
            <Kicker className="-mb-2">{t(CTA.kicker)}</Kicker>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{t(CTA.title)}</h2>
            <p className="max-w-lg text-base text-ink/70 sm:text-lg">{t(CTA.text)}</p>
            <div className="mt-2 flex flex-col gap-4">
              <Button asChild variant="brand" size="xl" className="w-fit">
                <a href="https://infra.dominants.link/">
                  {t(CTA.button)}
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
              <ContactLinks />
            </div>
          </div>
          <Illustration slot="cta" className="mx-auto w-full max-w-md" />
        </div>
      </BlurFade>
    </Section>
  )
}
