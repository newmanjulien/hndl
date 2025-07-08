import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        default: "py-12",
        sm: "py-8",
        lg: "py-16",
      },
      variant: {
        default: "",
        loading: "min-h-screen bg-gray-50",
        inline: "",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const emptyStateIconVariants = cva(
  "flex items-center justify-center mx-auto mb-4 rounded-lg",
  {
    variants: {
      variant: {
        default: "w-12 h-12 bg-gray-100",
        loading: "w-8 h-8 bg-transparent",
        small: "w-6 h-6 bg-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const emptyStateTitleVariants = cva("font-medium text-gray-900 mb-2", {
  variants: {
    variant: {
      default: "text-lg",
      loading: "text-lg",
      small: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const emptyStateDescriptionVariants = cva(
  "text-gray-500 mb-6 max-w-sm mx-auto",
  {
    variants: {
      variant: {
        default: "text-sm",
        loading: "text-sm",
        small: "text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof emptyStateVariants>
>(({ className, size, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(emptyStateVariants({ size, variant }), className)}
    {...props}
  />
));
EmptyState.displayName = "EmptyState";

const EmptyStateIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof emptyStateIconVariants>
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(emptyStateIconVariants({ variant }), className)}
    {...props}
  >
    {children}
  </div>
));
EmptyStateIcon.displayName = "EmptyStateIcon";

const EmptyStateTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof emptyStateTitleVariants>
>(({ className, variant, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(emptyStateTitleVariants({ variant }), className)}
    {...props}
  />
));
EmptyStateTitle.displayName = "EmptyStateTitle";

const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof emptyStateDescriptionVariants>
>(({ className, variant, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(emptyStateDescriptionVariants({ variant }), className)}
    {...props}
  />
));
EmptyStateDescription.displayName = "EmptyStateDescription";

const EmptyStateActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center space-x-3", className)}
    {...props}
  />
));
EmptyStateActions.displayName = "EmptyStateActions";

// Pre-built loading state component
const LoadingState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    variant?: "default" | "fullscreen" | "inline";
  }
>(
  (
    {
      className,
      title = "Loading...",
      description = "Please wait",
      variant = "default",
      ...props
    },
    ref
  ) => (
    <EmptyState
      ref={ref}
      variant={variant === "fullscreen" ? "loading" : "inline"}
      size={variant === "fullscreen" ? "lg" : "default"}
      className={cn(variant === "fullscreen" ? "min-h-screen" : "", className)}
      {...props}
    >
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    </EmptyState>
  )
);
LoadingState.displayName = "LoadingState";

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  LoadingState,
};
