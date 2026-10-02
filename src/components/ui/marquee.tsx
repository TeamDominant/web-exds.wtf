import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /** Run left-to-right instead of right-to-left. */
  reverse?: boolean
  /** Stop while the mouse is over it. */
  pauseOnHover?: boolean
  /** Seconds to scroll past one copy of the content. */
  duration?: number
  /** Copies of the content in the track; together they must be wider than the screen plus one copy. */
  repeat?: number
  children: ReactNode
}

/** Past this many pixels a press is a drag, and the click it ends with is swallowed. */
const DRAG_THRESHOLD = 6

/**
 * An endless horizontal ribbon that can also be scrolled by hand: drag it with the mouse or swipe it.
 * Started as Magic UI's CSS marquee; the motion is driven from JS so a drag picks up exactly where the
 * ribbon is, and a fling coasts to a stop before the auto-scroll takes over again.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  duration = 40,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const copy = track?.firstElementChild
    if (!root || !track || !(copy instanceof HTMLElement)) return

    // width of one copy plus the gap after it — the distance after which the ribbon repeats
    let period = 0
    const measure = () => (period = copy.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0"))
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(copy)

    let offset = 0
    let velocity = 0 // px/s left over from a fling
    let hovered = false
    let visible = false
    let frame = 0
    let last = 0
    let drag: { id: number; x: number; t: number; moved: number } | null = null
    let swallowClick = false

    const render = () => {
      if (period > 0) offset = ((offset % period) + period) % period
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000
      last = now
      if (!drag) {
        offset += velocity * dt
        velocity = Math.abs(velocity) < 10 ? 0 : velocity * Math.pow(0.04, dt)
        if (!reduce && !hovered && !velocity && period) offset += ((reverse ? -1 : 1) * period * dt) / duration
      }
      render()
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (frame || !visible) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    // no work while the ribbon is off screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    io.observe(root)
    render()

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return
      drag = { id: e.pointerId, x: e.clientX, t: e.timeStamp, moved: 0 }
      velocity = 0
      swallowClick = false
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      const dt = Math.max(e.timeStamp - drag.t, 1)
      drag.moved += Math.abs(dx)
      if (drag.moved > DRAG_THRESHOLD && !root.hasPointerCapture(e.pointerId)) {
        root.setPointerCapture(e.pointerId)
        root.dataset.dragging = ""
      }
      offset -= dx
      velocity = 0.8 * ((-dx / dt) * 1000) + 0.2 * velocity
      drag.x = e.clientX
      drag.t = e.timeStamp
      render()
    }
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      swallowClick = drag.moved > DRAG_THRESHOLD
      // held still before letting go: no fling
      if (e.type === "pointercancel" || e.timeStamp - drag.t > 80) velocity = 0
      drag = null
      delete root.dataset.dragging
    }
    // a drag that ends over a link or a button must not click it
    const onClick = (e: MouseEvent) => {
      if (!swallowClick) return
      e.preventDefault()
      e.stopPropagation()
      swallowClick = false
    }
    // links and images would otherwise start the browser's own drag-and-drop
    const onDragStart = (e: DragEvent) => e.preventDefault()
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = pauseOnHover
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = false
    }

    root.addEventListener("pointerdown", onDown)
    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerup", onUp)
    root.addEventListener("pointercancel", onUp)
    root.addEventListener("click", onClick, true)
    root.addEventListener("dragstart", onDragStart)
    root.addEventListener("pointerenter", onEnter)
    root.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      resize.disconnect()
      root.removeEventListener("pointerdown", onDown)
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerup", onUp)
      root.removeEventListener("pointercancel", onUp)
      root.removeEventListener("click", onClick, true)
      root.removeEventListener("dragstart", onDragStart)
      root.removeEventListener("pointerenter", onEnter)
      root.removeEventListener("pointerleave", onLeave)
    }
  }, [reverse, pauseOnHover, duration, reduce])

  return (
    <div
      ref={rootRef}
      {...props}
      // pan-y: vertical swipes still scroll the page, horizontal ones move the ribbon
      className={cn(
        "cursor-grab touch-pan-y overflow-hidden p-2 select-none [--gap:1rem] data-dragging:cursor-grabbing",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max gap-(--gap) will-change-transform">
        {Array.from({ length: repeat }, (_, i) => (
          // the copies are decoration: hidden from screen readers and out of the tab order
          <div key={i} className="flex shrink-0 gap-(--gap)" aria-hidden={i > 0 || undefined} inert={i > 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
