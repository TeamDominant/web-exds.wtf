import { useMemo, type ReactNode } from "react"
import { createAvatar } from "@dicebear/core"
import * as notionists from "@dicebear/notionists"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------
   Notion-style placeholder art.
   Characters: DiceBear "Notionists" by Zoish (CC0 1.0).
   Doodles: hand-drawn-style strokes in the same ink color.
   Replaced automatically by real images — see <Illustration />.
   ------------------------------------------------------------------ */

const CHARACTERS = {
  waver: { seed: "Mia", gesture: ["waveLongArms"], gestureProbability: 100, glassesProbability: 0, bodyIconProbability: 0 },
  pointer: { seed: "Leo", gesture: ["pointLongArm"], gestureProbability: 100, glassesProbability: 100, bodyIconProbability: 0 },
  caller: { seed: "Ava", gesture: ["handPhone"], gestureProbability: 100, glassesProbability: 0, bodyIconProbability: 0 },
  okay: { seed: "Max", gesture: ["okLongArm"], gestureProbability: 100, glassesProbability: 0, bodyIcon: ["electric"], bodyIconProbability: 100 },
  thinker: { seed: "Zoe", gesture: ["hand"], gestureProbability: 100, glassesProbability: 100, bodyIconProbability: 0 },
  greeter: { seed: "Sam", gesture: ["waveOkLongArms"], gestureProbability: 100, glassesProbability: 0, bodyIcon: ["saturn"], bodyIconProbability: 100 },
} satisfies Record<string, notionists.Options & { seed: string }>

export type Character = keyof typeof CHARACTERS

export function NotionAvatar({ character, className }: { character: Character; className?: string }) {
  const src = useMemo(() => createAvatar(notionists, CHARACTERS[character]).toDataUri(), [character])
  return <img src={src} alt="" aria-hidden draggable={false} className={cn("select-none", className)} />
}

const PASTEL = {
  yellow: "bg-sticker-yellow",
  blue: "bg-sticker-blue",
  green: "bg-sticker-green",
  pink: "bg-sticker-pink",
  purple: "bg-sticker-purple",
  orange: "bg-sticker-orange",
} as const

export type Pastel = keyof typeof PASTEL

/** A Notion-style "face sticker": character in an outlined pastel circle. */
export function Sticker({ character, bg, className }: { character: Character; bg: Pastel; className?: string }) {
  return (
    <div
      className={cn(
        "absolute aspect-square overflow-hidden rounded-full border-[2.5px] border-ink shadow-[3px_4px_0_0_var(--shadow-hard)]",
        PASTEL[bg],
        className
      )}
    >
      <NotionAvatar character={character} className="size-full translate-y-[7%] scale-110" />
    </div>
  )
}

/* ---------------------------- doodles ---------------------------- */

const ink = "var(--ink)"
const brand = "var(--brand)"
const stroke = { stroke: ink, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const

type At = { x: number; y: number; s?: number; r?: number }
const place = ({ x, y, s = 1, r = 0 }: At) => `translate(${x} ${y}) rotate(${r}) scale(${s})`

/** Sketchy double stroke: a crisp outline plus a faint offset pass. */
function Sketch({ d, fill = "var(--card)" }: { d: string; fill?: string }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={d} {...stroke} strokeWidth={1.4} opacity={0.35} transform="translate(2.5 3)" />
      <path d={d} {...stroke} />
    </>
  )
}

export function Shield(at: At) {
  const d = "M0 -95 C28 -80 56 -74 80 -72 C84 -12 70 52 0 95 C-70 52 -84 -12 -80 -72 C-56 -74 -28 -80 0 -95 Z"
  return (
    <g transform={place(at)}>
      <Sketch d={d} />
      <path d="M-30 2 L-8 24 L34 -22" stroke={brand} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  )
}

export function GlobeDoodle(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M0 -40 A40 40 0 1 1 -0.1 -40 Z" fill="var(--pastel-blue)" />
      <ellipse rx={16} ry={40} {...stroke} strokeWidth={2.5} />
      <path d="M-40 0 H40 M-35 -18 Q0 -10 35 -18 M-35 18 Q0 26 35 18" {...stroke} strokeWidth={2.5} />
    </g>
  )
}

export function Bolt(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M10 -42 L-22 6 L0 6 L-10 42 L24 -8 L2 -8 Z" fill="var(--pastel-yellow)" />
    </g>
  )
}

export function Sparkle({ fill = ink, ...at }: At & { fill?: string }) {
  return (
    <path
      transform={place(at)}
      d="M0 -13 C2 -3 3 -2 13 0 C3 2 2 3 0 13 C-2 3 -3 2 -13 0 C-3 -2 -2 -3 0 -13 Z"
      fill={fill}
    />
  )
}

export function Lock(at: At) {
  return (
    <g transform={place(at)}>
      <path d="M-15 -6 V-20 A15 15 0 0 1 15 -20 V-6" {...stroke} />
      <Sketch d="M-26 -6 H26 A8 8 0 0 1 34 2 V32 A8 8 0 0 1 26 40 H-26 A8 8 0 0 1 -34 32 V2 A8 8 0 0 1 -26 -6 Z" fill="var(--pastel-yellow)" />
      <circle cy={12} r={5} fill={ink} />
      <path d="M0 14 V26" {...stroke} strokeWidth={4} />
    </g>
  )
}

export function ChatBubble(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M-40 -28 H40 A12 12 0 0 1 52 -16 V12 A12 12 0 0 1 40 24 H-8 L-28 40 L-24 24 H-40 A12 12 0 0 1 -52 12 V-16 A12 12 0 0 1 -40 -28 Z" />
      <circle cx={-20} cy={-2} r={4.5} fill={ink} />
      <circle cx={0} cy={-2} r={4.5} fill={ink} />
      <circle cx={20} cy={-2} r={4.5} fill={brand} />
    </g>
  )
}

export function Phone(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M-18 -36 H18 A8 8 0 0 1 26 -28 V28 A8 8 0 0 1 18 36 H-18 A8 8 0 0 1 -26 28 V-28 A8 8 0 0 1 -18 -36 Z" />
      <path d="M-6 -27 H6 M-5 27 H5" {...stroke} strokeWidth={2.5} />
    </g>
  )
}

export function Laptop(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M-44 -32 H44 A6 6 0 0 1 50 -26 V24 H-50 V-26 A6 6 0 0 1 -44 -32 Z" fill="var(--pastel-purple)" />
      <Sketch d="M-62 24 H62 L54 36 H-54 Z" />
      <path d="M-24 -4 L-10 8 L20 -18" stroke={brand} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  )
}

export function PlanCard(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M-50 -34 H50 A8 8 0 0 1 58 -26 V26 A8 8 0 0 1 50 34 H-50 A8 8 0 0 1 -58 26 V-26 A8 8 0 0 1 -50 -34 Z" fill="var(--pastel-pink)" />
      <path d="M-40 -16 H0 M-40 0 H20 M-40 16 H-10" {...stroke} strokeWidth={2.5} />
      <circle cx={34} cy={14} r={9} fill={brand} />
    </g>
  )
}

export function DownloadDoodle(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M0 -36 A36 36 0 1 1 -0.1 -36 Z" fill="var(--pastel-green)" />
      <path d="M0 -18 V16 M-14 3 L0 17 L14 3" {...stroke} strokeWidth={4} />
    </g>
  )
}

export function PowerDoodle(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M0 -42 A42 42 0 1 1 -0.1 -42 Z" fill="var(--brand-soft)" />
      <path d="M-16 -18 A22 22 0 1 0 16 -18" stroke={brand} strokeWidth={6} strokeLinecap="round" fill="none" />
      <path d="M0 -28 V-2" stroke={brand} strokeWidth={6} strokeLinecap="round" />
    </g>
  )
}

export function QuestionDoodle(at: At) {
  return (
    <g transform={place(at)}>
      <Sketch d="M0 -38 A38 38 0 1 1 -0.1 -38 Z" fill="var(--pastel-yellow)" />
      <path d="M-11 -10 A11 11 0 1 1 3 1 C0 3 0 6 0 10" {...stroke} strokeWidth={4.5} />
      <circle cy={22} r={3.5} fill={ink} />
    </g>
  )
}

export function Dashes({ d }: { d: string }) {
  return <path d={d} {...stroke} strokeWidth={2.5} strokeDasharray="1 9" />
}

export function Blob({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} />
}

/* ---------------------------- scenes ----------------------------- */

type StickerSpec = { character: Character; bg: Pastel; className: string }

/**
 * A scene is an SVG doodle layer plus absolutely-positioned character stickers.
 * The wrapper keeps the SVG's aspect ratio so % positions line up with the drawing.
 */
export function Scene({
  viewBox,
  aspect,
  children,
  stickers = [],
  className,
}: {
  viewBox: string
  aspect: string
  children: ReactNode
  stickers?: StickerSpec[]
  className?: string
}) {
  return (
    <div className={cn("relative w-full", className)} style={{ aspectRatio: aspect }}>
      <svg viewBox={viewBox} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {children}
      </svg>
      {stickers.map((s) => (
        <Sticker key={s.character} {...s} />
      ))}
    </div>
  )
}
