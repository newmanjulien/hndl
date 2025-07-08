import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 shadow-sm",
        delete:
          "text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500 border border-transparent hover:border-red-300 [&_svg]:w-3 [&_svg]:h-3",
        edit: "text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent",
        back: "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-transparent",
        run: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400",
        pause:
          "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 shadow-sm",
        saved:
          "bg-green-600 text-white border-green-600 shadow-sm hover:bg-green-600 hover:border-green-600",
        updating:
          "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 border-gray-200 hover:bg-gray-100 hover:border-gray-200",
        "toggle-active":
          "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200 hover:border-orange-300 focus:ring-orange-500",
        "toggle-inactive":
          "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 shadow-sm",
        "toggle-human":
          "bg-gray-800 text-white hover:bg-gray-700 border-gray-800 hover:border-gray-700",
        move: "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 focus:ring-gray-500 disabled:text-gray-300 disabled:hover:text-gray-300 disabled:hover:bg-transparent disabled:border-gray-100 disabled:cursor-not-allowed",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-3 py-1.5 text-sm",
        sm: "h-9 rounded-md px-3",
        lg: "h-9 rounded-md px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
