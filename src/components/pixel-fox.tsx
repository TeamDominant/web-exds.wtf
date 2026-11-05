import fox from "@/assets/brand/fox.gif"
import { cn } from "@/lib/utils"

/**
 * Decorative 33×26 pixel art, scaled 2× so its pixels stay square. At 52px tall it fits inside the
 * py-12 / py-14 gaps it stands in, so it never affects the layout around it.
 */
export function PixelFox({ className }: { className?: string }) {
  return (
    <img
      src={fox}
      alt=""
      width={33}
      height={26}
      className={cn("pointer-events-none absolute h-auto w-[66px] select-none [image-rendering:pixelated]", className)}
    />
  )
}
