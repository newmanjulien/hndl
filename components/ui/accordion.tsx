"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
  {
    variants: {
      variant: {
        default: "",
        playbook:
          "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left [&[data-state=open]>svg]:rotate-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
    VariantProps<typeof accordionTriggerVariants>
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(accordionTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {variant === "default" && (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const accordionContentVariants = cva(
  "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        default: "",
        playbook: "border-t border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> &
    VariantProps<typeof accordionContentVariants>
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(accordionContentVariants({ variant }), className)}
    {...props}
  >
    {variant === "default" ? (
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    ) : (
      children
    )}
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// Layout components (these make sense as separate components)
const AccordionTitleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-3", className)}
    {...props}
  />
));
AccordionTitleGroup.displayName = "AccordionTitleGroup";

const AccordionIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center",
      className
    )}
    {...props}
  />
));
AccordionIcon.displayName = "AccordionIcon";

const AccordionChevron = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
));
AccordionChevron.displayName = "AccordionChevron";

// Text components with variants (this makes more sense)
const accordionTextVariants = cva("", {
  variants: {
    variant: {
      title: "font-medium text-gray-900",
      subtitle: "text-sm text-gray-500 mt-0.5",
    },
  },
  defaultVariants: {
    variant: "title",
  },
});

const AccordionText = React.forwardRef<
  HTMLHeadingElement | HTMLParagraphElement,
  (
    | React.HTMLAttributes<HTMLHeadingElement>
    | React.HTMLAttributes<HTMLParagraphElement>
  ) &
    VariantProps<typeof accordionTextVariants> & {
      as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
    }
>(
  (
    {
      className,
      variant,
      as: Component = variant === "title" ? "h3" : "p",
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref as any}
      className={cn(accordionTextVariants({ variant }), className)}
      {...props}
    />
  )
);
AccordionText.displayName = "AccordionText";

// Description components with variants
const accordionDescriptionVariants = cva("", {
  variants: {
    variant: {
      container: "px-6 py-4 bg-gray-50 border-b border-gray-200",
      text: "text-sm text-gray-600",
    },
  },
  defaultVariants: {
    variant: "container",
  },
});

const AccordionDescription = React.forwardRef<
  HTMLDivElement | HTMLParagraphElement,
  (
    | React.HTMLAttributes<HTMLDivElement>
    | React.HTMLAttributes<HTMLParagraphElement>
  ) &
    VariantProps<typeof accordionDescriptionVariants> & {
      as?: "div" | "p";
    }
>(
  (
    {
      className,
      variant,
      as: Component = variant === "text" ? "p" : "div",
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref as any}
      className={cn(accordionDescriptionVariants({ variant }), className)}
      {...props}
    />
  )
);
AccordionDescription.displayName = "AccordionDescription";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionTitleGroup,
  AccordionIcon,
  AccordionChevron,
  AccordionText,
  AccordionDescription,
};
