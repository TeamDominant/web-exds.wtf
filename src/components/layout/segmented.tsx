import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type SegmentedOption<T extends string> = {
  value: T
  content: ReactNode
  /** Accessible name + tooltip, for icon-only options. */
  label?: string
}

const SIZES = {
  sm: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
  // touch-friendly, used in the mobile menu
  lg: "h-9 px-3.5 text-sm [&_svg]:size-4",
} as const

/** Pill-shaped group of toggle buttons (language, theme). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = "sm",
  className,
}: {
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex rounded-full bg-muted p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cn(
            "inline-flex items-center justify-center rounded-full font-semibold text-muted-foreground transition-colors hover:text-ink focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            SIZES[size],
            value === option.value && "bg-background text-ink shadow-sm"
          )}
        >
          {option.content}
        </button>
      ))}
    </div>
  )
}
