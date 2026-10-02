import type { ReactNode } from "react"

import type { IllustrationSlot } from "@/components/illustration"

import {
  Blob,
  Bolt,
  ChatBubble,
  Dashes,
  DownloadDoodle,
  GlobeDoodle,
  Laptop,
  Lock,
  Phone,
  PlanCard,
  PowerDoodle,
  QuestionDoodle,
  Scene,
  Shield,
  Sparkle,
} from "@/components/notion-art"

const brandSoft = "var(--brand-soft)"
const yellow = "var(--pastel-yellow)"
const blue = "var(--pastel-blue)"
const green = "var(--pastel-green)"
const brand = "var(--brand)"

const PLACEHOLDERS = {
  hero: (
    <Scene
      viewBox="0 0 600 500"
      aspect="6 / 5"
      stickers={[
        { character: "waver", bg: "yellow", className: "left-[1%] bottom-[3%] w-[33%]" },
        { character: "pointer", bg: "blue", className: "right-[1%] top-[40%] w-[27%]" },
        { character: "caller", bg: "green", className: "right-[12%] top-[1%] w-[21%]" },
      ]}
    >
      <Blob d="M300 40 C420 30 560 90 570 220 C580 350 480 470 330 470 C180 470 40 420 35 280 C30 150 170 50 300 40 Z" fill={brandSoft} />
      <Dashes d="M150 360 C190 300 220 290 250 280" />
      <Dashes d="M440 270 C410 260 390 250 370 240" />
      <Dashes d="M420 120 C400 150 380 160 360 170" />
      <Shield x={305} y={240} s={1.25} r={-3} />
      <GlobeDoodle x={115} y={120} s={0.95} />
      <Bolt x={235} y={75} s={0.8} r={12} />
      <Sparkle x={485} y={420} s={1.3} fill={brand} />
      <Sparkle x={60} y={260} s={0.9} />
      <Sparkle x={400} y={60} s={0.8} />
    </Scene>
  ),
  privacy: (
    <Scene
      viewBox="0 0 400 260"
      aspect="400 / 260"
      stickers={[{ character: "pointer", bg: "blue", className: "left-[4%] bottom-[6%] w-[34%]" }]}
    >
      <Blob d="M200 20 C300 10 390 60 385 140 C380 220 300 250 210 245 C120 240 20 210 25 130 C30 60 110 25 200 20 Z" fill={blue} />
      <Shield x={255} y={130} s={0.95} r={4} />
      <Lock x={355} y={70} s={0.6} r={10} />
      <Sparkle x={150} y={40} s={0.8} />
    </Scene>
  ),
  devices: (
    <Scene
      viewBox="0 0 400 260"
      aspect="400 / 260"
      stickers={[{ character: "okay", bg: "purple", className: "right-[3%] bottom-[5%] w-[32%]" }]}
    >
      <Blob d="M190 25 C290 15 385 55 380 135 C375 215 300 250 200 245 C110 240 20 215 25 135 C30 60 100 30 190 25 Z" fill={yellow} />
      <Laptop x={150} y={130} s={1.2} r={-3} />
      <Phone x={290} y={80} s={0.75} r={10} />
      <Sparkle x={60} y={50} s={0.8} fill={brand} />
    </Scene>
  ),
  support: (
    <Scene
      viewBox="0 0 400 260"
      aspect="400 / 260"
      stickers={[{ character: "caller", bg: "green", className: "left-[5%] bottom-[5%] w-[33%]" }]}
    >
      <Blob d="M210 25 C310 20 390 70 380 145 C370 220 290 250 200 245 C110 240 25 210 30 130 C35 55 120 30 210 25 Z" fill={green} />
      <ChatBubble x={265} y={110} s={1.25} r={-4} />
      <Sparkle x={360} y={210} s={0.9} fill={brand} />
      <Sparkle x={170} y={45} s={0.7} />
    </Scene>
  ),
  "step-1": (
    <Scene
      viewBox="0 0 400 260"
      aspect="400 / 260"
      stickers={[{ character: "thinker", bg: "pink", className: "right-[6%] bottom-[5%] w-[34%]" }]}
    >
      <Blob d="M200 30 C300 20 380 70 375 140 C370 215 290 245 200 240 C110 235 30 205 30 135 C30 65 100 40 200 30 Z" fill={brandSoft} />
      <PlanCard x={140} y={120} s={1.3} r={-6} />
      <Sparkle x={70} y={215} s={0.9} />
    </Scene>
  ),
  "step-2": (
    <Scene
      viewBox="0 0 400 260"
      aspect="400 / 260"
      stickers={[{ character: "okay", bg: "yellow", className: "left-[5%] bottom-[5%] w-[33%]" }]}
    >
      <Blob d="M200 30 C300 20 380 70 375 140 C370 215 290 245 200 240 C110 235 30 205 30 135 C30 65 100 40 200 30 Z" fill={green} />
      <Laptop x={260} y={140} s={1.05} r={3} />
      <DownloadDoodle x={300} y={50} s={0.75} />
    </Scene>
  ),
  "step-3": (
    <Scene
      viewBox="0 0 400 260"
      aspect="400 / 260"
      stickers={[{ character: "greeter", bg: "blue", className: "right-[5%] bottom-[5%] w-[34%]" }]}
    >
      <Blob d="M200 30 C300 20 380 70 375 140 C370 215 290 245 200 240 C110 235 30 205 30 135 C30 65 100 40 200 30 Z" fill={yellow} />
      <PowerDoodle x={140} y={125} s={1.35} />
      <Bolt x={250} y={55} s={0.55} r={15} />
      <Sparkle x={60} y={50} s={0.8} fill={brand} />
    </Scene>
  ),
  faq: (
    <Scene
      viewBox="0 0 400 300"
      aspect="400 / 300"
      stickers={[{ character: "thinker", bg: "purple", className: "left-[6%] bottom-[4%] w-[36%]" }]}
    >
      <Blob d="M200 30 C310 20 390 80 380 160 C370 250 290 285 195 280 C100 275 20 235 25 150 C30 70 100 40 200 30 Z" fill={blue} />
      <QuestionDoodle x={275} y={105} s={1.4} r={8} />
      <ChatBubble x={300} y={230} s={0.6} r={-6} />
      <Sparkle x={140} y={50} s={0.9} fill={brand} />
    </Scene>
  ),
  cta: (
    <Scene
      viewBox="0 0 440 300"
      aspect="440 / 300"
      stickers={[
        { character: "waver", bg: "yellow", className: "left-[2%] bottom-[6%] w-[34%]" },
        { character: "greeter", bg: "pink", className: "right-[2%] bottom-[10%] w-[30%]" },
      ]}
    >
      <Dashes d="M150 190 C190 130 250 130 300 180" />
      <Shield x={220} y={105} s={0.75} r={-4} />
      <Sparkle x={70} y={70} s={1} fill={brand} />
      <Sparkle x={380} y={60} s={0.8} />
    </Scene>
  ),
  legal: (
    <Scene
      viewBox="0 0 400 300"
      aspect="400 / 300"
      stickers={[{ character: "thinker", bg: "yellow", className: "left-[6%] bottom-[4%] w-[36%]" }]}
    >
      <Blob d="M200 30 C310 20 390 80 380 160 C370 250 290 285 195 280 C100 275 20 235 25 150 C30 70 100 40 200 30 Z" fill={green} />
      <Shield x={270} y={140} s={1.1} r={4} />
      <Lock x={350} y={60} s={0.6} r={10} />
      <Sparkle x={140} y={50} s={0.9} fill={brand} />
    </Scene>
  ),
} satisfies Record<IllustrationSlot, ReactNode>

/** Loaded lazily by <Illustration /> only when a slot has no provided image. */
export default function Placeholder({ slot }: { slot: IllustrationSlot }) {
  return PLACEHOLDERS[slot]
}
