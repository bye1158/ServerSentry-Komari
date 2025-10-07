import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  color?: "default" | "success" | "warning" | "danger"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color = "default", ...props }, ref) => {
    // Normalize value to be between 0 and 100
    const normalizedValue = Math.min(Math.max(0, (value / max) * 100), 100)

    // Determine color based on value
    let colorClass = ""
    switch (color) {
      case "success":
        colorClass = "bg-success"
        break
      case "warning":
        colorClass = "bg-warning"
        break
      case "danger":
        colorClass = "bg-destructive"
        break
      default:
        colorClass = "bg-primary"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 transition-all", colorClass)}
          style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress } 