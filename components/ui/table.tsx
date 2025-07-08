import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tableContainerVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "overflow-auto",
      workflow: "overflow-hidden rounded-lg border border-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof tableContainerVariants>
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(tableContainerVariants({ variant }), className)}
    {...props}
  >
    {children}
  </div>
));
TableContainer.displayName = "TableContainer";

const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default: "",
      workflow: "min-w-full divide-y divide-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>
>(({ className, variant, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(tableVariants({ variant }), className)}
    {...props}
  />
));
Table.displayName = "Table";

const tableHeaderVariants = cva("[&_tr]:border-b", {
  variants: {
    variant: {
      default: "",
      workflow: "bg-gray-50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> &
    VariantProps<typeof tableHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(tableHeaderVariants({ variant }), className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const tableBodyVariants = cva("[&_tr:last-child]:border-0", {
  variants: {
    variant: {
      default: "",
      workflow: "bg-white divide-y divide-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> &
    VariantProps<typeof tableBodyVariants>
>(({ className, variant, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(tableBodyVariants({ variant }), className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const tableRowVariants = cva(
  "border-b transition-colors data-[state=selected]:bg-muted",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        workflow: "hover:bg-gray-50 transition-colors duration-150",
        playbook: "bg-blue-50 hover:bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> &
    VariantProps<typeof tableRowVariants>
>(({ className, variant, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(tableRowVariants({ variant }), className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const tableHeadVariants = cva(
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      variant: {
        default: "",
        workflow:
          "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider",
        "workflow-right":
          "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> &
    VariantProps<typeof tableHeadVariants>
>(({ className, variant, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(tableHeadVariants({ variant }), className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const tableCellVariants = cva(
  "p-4 align-middle [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      variant: {
        default: "",
        workflow: "px-6 py-4 text-sm text-gray-900",
        "workflow-right": "px-6 py-4 text-right text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> &
    VariantProps<typeof tableCellVariants>
>(({ className, variant, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(tableCellVariants({ variant }), className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableContainerVariants,
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
};
