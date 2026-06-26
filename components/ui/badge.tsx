import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-black",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neon text-black shadow-[0_0_10px_rgba(0,255,0,0.3)]",
        secondary: "border-transparent bg-purple text-black shadow-[0_0_10px_rgba(199,125,255,0.3)]",
        outline: "text-white border-white/20",
        ghost: "text-white/70 border-transparent hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
