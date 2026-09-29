import mark from "@/assets/brand/Dominant_BLACK_BG_SQUARE.svg"
import { cn } from "@/lib/utils"

/** The fox-mask brand mark on its black tile. */
export function LogoMark({ className }: { className?: string }) {
  return <img src={mark} alt="" aria-hidden draggable={false} className={cn("select-none", className)} />
}

export function Logo({ className }: { className?: string }) {
  return (
    <a
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-ink",
        className
      )}
    >
      <LogoMark className="size-9 rounded-[11px] border-2 border-ink shadow-[2px_3px_0_0_var(--shadow-hard)] transition-transform group-hover:-rotate-6" />
      <span>
        Team<span className="text-brand">Dominant</span>
      </span>
    </a>
  )
}
