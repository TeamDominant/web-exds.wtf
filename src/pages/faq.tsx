import { Send } from "lucide-react"

import { Illustration } from "@/components/illustration"
import { PageHero } from "@/components/layout/page-hero"
import { Container } from "@/components/layout/section"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { CONTACTS, FAQ } from "@/content/site"
import { useDocumentMeta, useI18n } from "@/lib/i18n"
import { FaqList } from "@/sections/faq"

const META = {
  title: { ru: "FAQ – TeamDominant", en: "FAQ – TeamDominant" },
  description: {
    ru: "Частые вопросы о VPN и прокси TeamDominant: устройства, оплата, протоколы, возвраты.",
    en: "TeamDominant VPN & proxy FAQ: devices, payments, protocols, refunds.",
  },
}

export function FaqPage() {
  const { t } = useI18n()
  useDocumentMeta(META.title, META.description)

  return (
    <>
      <PageHero
        kicker={t(FAQ.kicker)}
        title={t(FAQ.title)}
        subtitle={t(FAQ.subtitle)}
        aside={<Illustration slot="faq" />}
      />
      <Container className="max-w-3xl py-14 sm:py-20">
        <BlurFade>
          <FaqList items={FAQ.items} />
        </BlurFade>
        <BlurFade inView className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-surface p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">{t(FAQ.stillStuck)}</h2>
          <Button asChild variant="brand" size="lg">
            <a href={CONTACTS.telegram}>
              <Send data-icon="inline-start" />
              {t(FAQ.writeUs)}
            </a>
          </Button>
        </BlurFade>
      </Container>
    </>
  )
}
