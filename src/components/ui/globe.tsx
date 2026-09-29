"use client"

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400
const TAU = Math.PI * 2
/** cobe draws the globe with this radius, as a share of the canvas half-size. */
const RADIUS = 0.8

type LatLon = [number, number]

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

const toRad = (deg: number) => (deg * Math.PI) / 180
const wrap = (angle: number) => ((angle % TAU) + TAU) % TAU
const samePlace = (a: LatLon, b: LatLon) => a[0] === b[0] && a[1] === b[1]

/** cobe's phi/theta that turn a location to the centre of the globe. */
const anglesFor = ([lat, lon]: LatLon) => [Math.PI - (toRad(lon) - Math.PI / 2), toRad(lat)] as const

/**
 * Screen position of a location for the given rotation, mirroring cobe's shader:
 * x/y in [-1, 1] (y up) and z > 0 when it faces the viewer.
 */
function project([lat, lon]: LatLon, phi: number, theta: number) {
  const px = Math.cos(toRad(lat)) * Math.cos(toRad(lon))
  const py = Math.sin(toRad(lat))
  const pz = -Math.cos(toRad(lat)) * Math.sin(toRad(lon))
  const [cp, sp, ct, st] = [Math.cos(phi), Math.sin(phi), Math.cos(theta), Math.sin(theta)]
  return {
    x: cp * px + sp * pz,
    y: sp * st * px + ct * py - cp * st * pz,
    z: -sp * ct * px + st * py + cp * ct * pz,
  }
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
  focus,
  label,
}: {
  className?: string
  config?: COBEOptions
  /** Turn the globe to this [lat, lon] and enlarge its marker; without it the globe just spins. */
  focus?: LatLon
  /** Pinned to the focused location while it faces the viewer. */
  label?: ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const phiRef = useRef(0)
  const thetaRef = useRef(config.theta)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const focusRef = useRef(focus)
  const reduce = useReducedMotion()
  const reduceRef = useRef(reduce)

  // layout effect: the next frame must already project the new location, not flash the new label at the old one
  useLayoutEffect(() => {
    focusRef.current = focus
    reduceRef.current = reduce
  }, [focus, reduce])

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  const release = () => {
    updatePointerInteraction(null)
    // a focused globe springs back to its location after a drag
    if (focusRef.current) r.set(0)
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    let last = performance.now()
    let markedFocus: LatLon | undefined

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        const now = performance.now()
        const dt = Math.min(64, now - last)
        last = now
        const target = focusRef.current

        if (target) {
          // ease towards the location, going the short way round
          const ease = reduceRef.current ? 1 : 1 - Math.pow(0.92, dt / (1000 / 60))
          const [phi, theta] = anglesFor(target)
          phiRef.current += (wrap(phi - phiRef.current + Math.PI) - Math.PI) * ease
          thetaRef.current += (theta - thetaRef.current) * ease
        } else if (!pointerInteracting.current) {
          phiRef.current += 0.005
        }
        state.phi = phiRef.current + rs.get()
        state.theta = thetaRef.current
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2

        if (target !== markedFocus) {
          markedFocus = target
          // the focused marker grows and goes last, so it's drawn over close neighbours
          const others = config.markers.filter((m) => !target || !samePlace(m.location, target))
          const focused = config.markers
            .filter((m) => target && samePlace(m.location, target))
            .map((m) => ({ ...m, size: m.size * 1.6 }))
          const markers = [...others, ...focused]
          // cobe 0.6.5 bug: an updated marker list sets the shader's count to `markers.length`, but each
          // marker takes two slots, so only the first half would be drawn. The shader reads just the
          // first copy of a doubled list, which restores the full set.
          state.markers = [...markers, ...markers]
        }

        const el = labelRef.current
        if (el && target) {
          const p = project(target, state.phi, state.theta)
          const half = widthRef.current / 2
          el.style.transform = `translate(${half + p.x * RADIUS * half}px, ${half - p.y * RADIUS * half}px)`
          // fade out as the point turns towards the far side
          el.style.opacity = String(Math.min(1, Math.max(0, (p.z - 0.25) / 0.35)))
        }
      },
    })

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1"
    }, 0)
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={release}
        onPointerOut={release}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
      {label && focus && (
        <div ref={labelRef} className="pointer-events-none absolute top-0 left-0 opacity-0">
          <div className="-translate-x-1/2 -translate-y-full">{label}</div>
        </div>
      )}
    </div>
  )
}
