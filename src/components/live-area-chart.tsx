import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { area, curveMonotoneX, line } from "d3-shape"
import { useInView, useReducedMotion } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

/*
  Live throughput chart in the style of shadcn's Area Chart (smooth curve, gradient fill,
  horizontal grid) without pulling in Recharts.

  Every `interval` ms a new sample slides in from the right while the oldest one slides out.
  The series carries one off-screen point on the left and two on the right, so the monotone
  curve's tangents never change inside the visible window when points are shifted — the
  scroll is seamless.
*/

const HIDDEN = 3 // 1 left + 2 right, outside the viewport
const GRID = [0.25, 0.5, 0.75]

/** Samples wander around `target` by up to ±`spread` per step and stay within [`min`, `max`]. */
type Walk = { target: number; spread: number; min: number; max: number }

/** Noisy value that keeps drifting back to `target`. */
function nextValue(prev: number, { target, spread, min, max }: Walk) {
  const value = prev + (target - prev) * 0.55 + (Math.random() - 0.5) * 2 * spread
  return Math.min(max, Math.max(min, value))
}

function seed(length: number, walk: Walk) {
  let value = walk.target
  return Array.from({ length }, () => (value = nextValue(value, walk)))
}

export function LiveAreaChart({
  target,
  spread,
  min,
  max,
  points = 14,
  interval = 2000,
  onValue,
  className,
}: Walk & {
  /** Visible intervals between samples. */
  points?: number
  interval?: number
  /** Latest sample that has reached the right edge. */
  onValue?: (value: number) => void
  className?: string
}) {
  const [series, setSeries] = useState(() => seed(points + HIDDEN + 1, { target, spread, min, max }))
  const [tick, setTick] = useState(0)

  // A new target (e.g. another server) bends the upcoming, still off-screen points towards it —
  // the visible history stays, and the curve swings to the new level as they slide in.
  const [seenTarget, setSeenTarget] = useState(target)
  if (seenTarget !== target) {
    setSeenTarget(target)
    setSeries((s) => {
      const walk = { target, spread, min, max }
      const a = nextValue(s[s.length - 3], walk)
      return [...s.slice(0, -2), a, nextValue(a, walk)]
    })
  }

  const step = useCallback(() => {
    setSeries((s) => [...s.slice(1), nextValue(s[s.length - 1], { target, spread, min, max })])
    setTick((t) => t + 1)
  }, [target, spread, min, max])
  // read through a ref so a new target doesn't restart the slide halfway through
  const stepRef = useRef(step)
  useLayoutEffect(() => {
    stepRef.current = step
  }, [step])

  const edge = series[series.length - 3]
  useEffect(() => {
    onValue?.(edge)
  }, [edge, onValue])

  const wrapRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<SVGGElement>(null)
  const [measureRef, { width, height }] = useMeasure()
  const inView = useInView(wrapRef)
  const reduce = useReducedMotion()
  const gradientId = useId()

  const dx = width / points
  // a little headroom so peaks at `min`/`max` don't touch the edges
  const pad = (max - min) * 0.08
  const x = (_: number, i: number) => (i - 1) * dx
  const y = (v: number) => height - ((v - min + pad) / (max - min + 2 * pad)) * height

  // Layout effect: the shifted data and the reset slide must land in the same frame.
  useLayoutEffect(() => {
    if (!inView || !width) return
    const advance = () => stepRef.current()
    if (reduce) {
      const id = setTimeout(advance, interval)
      return () => clearTimeout(id)
    }
    const slide = slideRef.current?.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${-dx}px)` }],
      { duration: interval, easing: "linear", fill: "forwards" }
    )
    if (!slide) return
    // start on the clock now rather than on the next frame, so a busy main thread can't stretch the period
    slide.startTime = document.timeline.currentTime
    slide.onfinish = advance
    return () => {
      slide.onfinish = null
      slide.cancel()
    }
  }, [tick, inView, reduce, width, dx, interval])

  return (
    <div ref={wrapRef} aria-hidden className={cn("relative text-brand", className)}>
      <div ref={measureRef} className="absolute inset-0">
        {width > 0 && (
          <svg width={width} height={height} className="block">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.8} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            {GRID.map((g) => (
              <line key={g} x1={0} x2={width} y1={height * g} y2={height * g} className="stroke-border/70" />
            ))}
            <g ref={slideRef}>
              <path
                d={area<number>().x(x).y0(height).y1(y).curve(curveMonotoneX)(series) ?? undefined}
                fill={`url(#${gradientId})`}
                fillOpacity={0.4}
              />
              <path
                d={line<number>().x(x).y(y).curve(curveMonotoneX)(series) ?? undefined}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  )
}
