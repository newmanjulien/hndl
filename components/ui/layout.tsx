import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Generic layout component that can handle multiple layout patterns
const layoutVariants = cva("", {
  variants: {
    variant: {
      // Page layouts
      "page-header": "bg-white border-b border-gray-200 shadow-sm",
      "page-content": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      "workflow-content": "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
      "page-inner": "flex items-center justify-between",
      // Step layouts
      "step-container": "bg-white rounded-lg border border-gray-200 p-4",
      "step-layout": "flex items-start space-x-4",
      "step-content": "flex-1",
      "step-actions": "mt-4 flex items-center justify-between",
      "step-assignment": "mt-4 pt-4 border-t border-gray-200",
      // Flex layouts
      "flex-center": "flex items-center justify-center",
      "flex-between": "flex items-center justify-between",
      "flex-start": "flex items-center justify-start",
      "flex-end": "flex items-center justify-end",
      // Spacing
      "space-x-2": "flex items-center space-x-2",
      "space-x-3": "flex items-center space-x-3",
      "space-x-4": "flex items-center space-x-4",
      // Right-aligned spacing
      "space-x-2-right": "flex items-center justify-end space-x-2",
      "space-x-3-right": "flex items-center justify-end space-x-3",
      "space-x-4-right": "flex items-center justify-end space-x-4",
      // Header grid
      "header-grid": "grid grid-cols-3 items-center h-full w-full",
      "header-left": "",
      "header-center": "justify-self-center",
      "header-right": "justify-self-end",
    },
    size: {
      default: "",
      sm: "h-12",
      md: "h-16",
      lg: "h-20",
    },
  },
  defaultVariants: {
    variant: "flex-center",
  },
});

const Layout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof layoutVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(layoutVariants({ variant, size }), className)}
    {...props}
  />
));
Layout.displayName = "Layout";

// Specialized components for common patterns
const PageHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { size?: "sm" | "md" | "lg" }
>(({ className, size = "md", ...props }, ref) => (
  <header
    ref={ref}
    className={cn(layoutVariants({ variant: "page-header", size }), className)}
    {...props}
  />
));
PageHeader.displayName = "PageHeader";

const StepNumber = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "large" | "completed";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "w-7 h-7 bg-green-100 text-green-700 text-sm",
    large: "w-8 h-8 bg-green-100 text-green-700 text-base",
    completed: "w-7 h-7 bg-green-600 text-white text-sm",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex-shrink-0 rounded-full flex items-center justify-center font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
StepNumber.displayName = "StepNumber";

const StepConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-start ml-3.5 py-3", className)}
    {...props}
  >
    <div className="w-px h-4 bg-gray-300" />
  </div>
));
StepConnector.displayName = "StepConnector";

export { Layout, PageHeader, StepNumber, StepConnector, layoutVariants };
