import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      // Text badges (primary use case)
      default: "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      outline:
        "rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-transparent",
      count: "rounded text-xs font-medium py-0.5 px-1.5 ml-2",
      // Status dots (secondary use case)
      dot: "w-2 h-2 rounded-full",
      "dot-with-label": "space-x-2",
    },
    color: {
      default: "",
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
      active: "",
      inactive: "",
    },
  },
  compoundVariants: [
    // Default badge colors
    {
      variant: "default",
      color: "default",
      class: "bg-primary text-primary-foreground border-transparent",
    },
    {
      variant: "default",
      color: "primary",
      class: "bg-primary text-primary-foreground border-transparent",
    },
    {
      variant: "default",
      color: "secondary",
      class: "bg-secondary text-secondary-foreground border-transparent",
    },
    {
      variant: "default",
      color: "success",
      class: "bg-green-100 text-green-800 border-transparent",
    },
    {
      variant: "default",
      color: "warning",
      class: "bg-yellow-100 text-yellow-800 border-transparent",
    },
    {
      variant: "default",
      color: "error",
      class: "bg-red-100 text-red-800 border-transparent",
    },
    {
      variant: "default",
      color: "active",
      class: "bg-green-100 text-green-800 border-transparent",
    },
    {
      variant: "default",
      color: "inactive",
      class: "bg-gray-100 text-gray-600 border-transparent",
    },

    // Outline badge colors
    {
      variant: "outline",
      color: "default",
      class: "border-input text-foreground",
    },
    {
      variant: "outline",
      color: "success",
      class: "border-green-300 text-green-700",
    },
    {
      variant: "outline",
      color: "warning",
      class: "border-yellow-300 text-yellow-700",
    },
    {
      variant: "outline",
      color: "error",
      class: "border-red-300 text-red-700",
    },

    // Count badge
    { variant: "count", color: "inactive", class: "bg-gray-100 text-gray-600" },

    // Dot colors
    { variant: "dot", color: "success", class: "bg-green-500" },
    { variant: "dot", color: "warning", class: "bg-yellow-500" },
    { variant: "dot", color: "error", class: "bg-red-500" },
    { variant: "dot", color: "active", class: "bg-green-500" },
    { variant: "dot", color: "inactive", class: "bg-gray-400" },
  ],
  defaultVariants: {
    variant: "default",
    color: "default",
  },
});

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof badgeVariants> & {
      label?: string;
      labelClassName?: string;
    }
>(
  (
    { className, variant, color, label, labelClassName, children, ...props },
    ref
  ) => {
    // Special handling for dot with label
    if (variant === "dot-with-label" && label) {
      return (
        <div
          ref={ref}
          className={cn(badgeVariants({ variant }), className)}
          {...props}
        >
          <div className={cn(badgeVariants({ variant: "dot", color }))} />
          <span className={cn("text-sm", labelClassName)}>{label}</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, color }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
