import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
  locale?: string
  /** Spring tuning; the default is a slow, overdamped count-up. */
  spring?: { damping?: number; stiffness?: number }
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  locale = "en-US",
  spring,
  ...props
}: NumberTickerProps) {
  const format = useCallback(
    (n: number) =>
      Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(n.toFixed(decimalPlaces))),
    [locale, decimalPlaces]
  )

  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    ...spring,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = format(latest)
        }
      }),
    [springValue, format]
  )

  // Text is written imperatively (never as React children) so re-renders — e.g. a locale
  // switch — re-format the current value instead of resetting it.
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.textContent = format(springValue.get())
    }
  }, [springValue, format])

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    />
  )
}
