import cat from "@/assets/brand/cat.gif"
import { cn } from "@/lib/utils"

/** Decorative 33×26 pixel art. Scaled by a whole number (2×, 3× from sm) so its pixels stay square. */
export function PixelCat({ className }: { className?: string }) {
  return (
    <img
      src={cat}
      alt=""
      width={33}
      height={26}
      className={cn(
        "pointer-events-none absolute h-auto w-[66px] select-none [image-rendering:pixelated] sm:w-[99px]",
        className,
      )}
    />
  )
}
