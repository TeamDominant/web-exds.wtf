import { META } from "@/content/site"
import { useDocumentMeta } from "@/lib/i18n"
import { Compare } from "@/sections/compare"
import { Cta } from "@/sections/cta"
import { Faq } from "@/sections/faq"
import { Features } from "@/sections/features"
import { Hero } from "@/sections/hero"
import { HowItWorks } from "@/sections/how-it-works"
import { Locations } from "@/sections/locations"
import { Platforms } from "@/sections/platforms"
import { Pricing } from "@/sections/pricing"
import { Testimonials } from "@/sections/testimonials"

export function HomePage() {
  useDocumentMeta(META.title, META.description)
  return (
    <>
      <Hero />
      <Platforms />
      <Features />
      <Pricing />
      <HowItWorks />
      <Locations />
      <Compare />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  )
}
