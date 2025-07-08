import React from "react";
import { cn } from "@/lib/utils";

// Base input styles - identical to your CSS classes
const baseInputStyles =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200 text-sm";

const baseTextareaStyles =
  "w-full min-h-20 text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors duration-200 text-sm";

const baseSelectStyles =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200 text-sm";

// TypeScript interfaces
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

// Input Component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          baseInputStyles,
          disabled && "bg-gray-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Textarea Component
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(baseTextareaStyles, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Select Component
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select className={cn(baseSelectStyles, className)} ref={ref} {...props}>
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
