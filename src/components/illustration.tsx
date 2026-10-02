import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Drop an image named after a slot into `src/assets/illustrations/`
 * (e.g. `hero.svg`, `step-1.png`) and it replaces the placeholder art — no code changes.
 * A `<slot>.mp4` (plus a `<slot>.webp` still) plays as a looping animation instead;
 * see scripts/encode-illustrations.py.
 */
const files = import.meta.glob<string>("../assets/illustrations/*.{svg,png,webp,avif,jpg,jpeg,mp4}", {
  eager: true,
  query: "?url",
  import: "default",
})

const images: Record<string, string> = {}
const videos: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "")
  if (path.endsWith(".mp4")) videos[name] = url
  else images[name] = url
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
  legal: "400 / 300",
} as const

export type IllustrationSlot = keyof typeof ASPECTS

// The animations are ink and watercolor on white paper. Multiply drops the white onto whatever is behind;
// in dark mode the frame is inverted (the hue turned back, so the pink stays pink) and screened instead.
// Nothing between the art and the backdrop may create a transparent stacking context (opacity, transform,
// filter — e.g. a <BlurFade> with no background of its own), or the paper shows as a white/black box.
// That's why the video fades itself in instead of relying on a wrapper.
const PAPER = "mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"

// The Notion-style placeholder art (DiceBear characters) is heavy, so it's only fetched
// when at least one slot on the page has no provided image.
const Placeholder = lazy(() => import("@/components/illustration-placeholders"))

/** Plays only while on screen; shows the still for reduced motion or when autoplay is blocked (iOS Low Power Mode). */
function Animation({ src, still, alt, eager }: { src: string; still?: string; alt: string; eager: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [blocked, setBlocked] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || reduce) return
    video.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return video.pause()
        video.play().catch((error: DOMException) => {
          // AbortError only means it was paused again before it started
          if (error.name === "NotAllowedError") setBlocked(true)
        })
      },
      { rootMargin: "200px" }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduce])

  const label = alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true }
  if ((reduce || blocked) && still) {
    return (
      <img
        src={still}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        draggable={false}
        className={cn("size-full object-contain select-none", PAPER)}
      />
    )
  }
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload={eager ? "auto" : "none"}
      onPlaying={() => setPlaying(true)}
      {...label}
      className={cn(
        "pointer-events-none size-full object-contain transition-[opacity,translate] duration-500 ease-out",
        !playing && "translate-y-1.5 opacity-0",
        PAPER
      )}
    />
  )
}

export function Illustration({
  slot,
  alt = "",
  eager = false,
  className,
}: {
  slot: IllustrationSlot
  alt?: string
  /** Start loading right away (above the fold) instead of when scrolled near. */
  eager?: boolean
  className?: string
}) {
  const video = videos[slot]
  if (video) {
    return (
      // overflow-hidden zeroes the flex/grid min-height, so the video's own height can't stretch the slot
      <div className={cn("overflow-hidden", className)} style={{ aspectRatio: ASPECTS[slot] }}>
        <Animation src={video} still={images[slot]} alt={alt} eager={eager} />
      </div>
    )
  }

  const src = images[slot]
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
