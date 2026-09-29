import { Laptop, Monitor, Router, Smartphone, Tablet, Tv, type LucideIcon } from "lucide-react"

import { Container } from "@/components/layout/section"
import { BlurFade } from "@/components/ui/blur-fade"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { PLATFORMS, type PlatformId } from "@/content/site"
import { useI18n } from "@/lib/i18n"

const ICONS: Record<PlatformId, LucideIcon> = {
  desktop: Monitor,
  laptop: Laptop,
  phone: Smartphone,
  tablet: Tablet,
  tv: Tv,
  router: Router,
}

export function Platforms() {
  const { t } = useI18n()
  return (
    <section id="platforms" className="border-y bg-surface py-12">
      <Container className="flex flex-col items-center gap-8">
        <BlurFade inView>
          <p className="max-w-xl text-center text-base font-medium text-ink sm:text-lg">{t(PLATFORMS.lead)}</p>
        </BlurFade>

        <BlurFade inView delay={0.1} className="grid w-full grid-cols-3 gap-3 sm:grid-cols-6">
          {PLATFORMS.items.map(({ id, label }) => {
            const Icon = ICONS[id]
            return (
              <div
                key={id}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-background px-2 py-4 text-center transition-transform hover:-translate-y-0.5"
              >
                <Icon className="size-6 text-ink" strokeWidth={1.6} />
                <span className="text-xs font-medium text-muted-foreground sm:text-sm">{t(label)}</span>
              </div>
            )
          })}
        </BlurFade>

        <InfiniteSlider
          gap={40}
          speed={30}
          speedOnHover={12}
          className="w-full [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        >
          {PLATFORMS.models.map((model) => {
            const name = typeof model === "string" ? model : t(model)
            return (
              <span key={name} className="font-heading text-xl font-bold whitespace-nowrap text-ink/35">
                {name}
              </span>
            )
          })}
        </InfiniteSlider>
      </Container>
    </section>
  )
}
