import { lazy, Suspense } from "react"

import { cn } from "@/lib/utils"

/**
 * Drop an image named after a slot into `src/assets/illustrations/`
 * (e.g. `hero.svg`, `step-1.png`) and it replaces the placeholder art — no code changes.
 */
const files = import.meta.glob<string>("../assets/illustrations/*.{svg,png,webp,avif,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
})

const provided: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "")
  provided[name] = url
}

/** Slot → aspect ratio of the placeholder art (also reserves space while it loads). */
const ASPECTS = {
  hero: "6 / 5",
  privacy: "400 / 260",
  devices: "400 / 260",
  support: "400 / 260",
  "step-1": "400 / 260",
  "step-2": "400 / 260",
  "step-3": "400 / 260",
  faq: "400 / 300",
  cta: "440 / 300",
} as const

export type IllustrationSlot = keyof typeof ASPECTS

// The Notion-style placeholder art (DiceBear characters) is heavy, so it's only fetched
// when at least one slot on the page has no provided image.
const Placeholder = lazy(() => import("@/components/illustration-placeholders"))

export function Illustration({
  slot,
  alt = "",
  className,
}: {
  slot: IllustrationSlot
  alt?: string
  className?: string
}) {
  const src = provided[slot]
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className={cn("h-auto w-full select-none", className)}
      />
    )
  }
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={className}
    >
      <Suspense fallback={<div style={{ aspectRatio: ASPECTS[slot] }} />}>
        <Placeholder slot={slot} />
      </Suspense>
    </div>
  )
}
