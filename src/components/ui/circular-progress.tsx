
import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: "small" | "medium" | "large";
  colorClass?: string;
  trackColorClass?: string;
}

export function CircularProgress({
  value = 0,
  size = "medium",
  colorClass = "text-primary",
  trackColorClass = "text-secondary",
  className,
  ...props
}: CircularProgressProps) {
  const sizeStyles = {
    small: {
      svgSize: 32,
      strokeWidth: 2.5,
    },
    medium: {
      svgSize: 64,
      strokeWidth: 4,
    },
    large: {
      svgSize: 96,
      strokeWidth: 6,
    },
  };

  const { svgSize, strokeWidth } = sizeStyles[size];
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex", className)}
      style={{
        width: svgSize,
        height: svgSize,
      }}
      {...props}
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={trackColorClass}
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          opacity={0.2}
        />
        <circle
          className={colorClass}
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
        />
      </svg>
    </div>
  );
}
