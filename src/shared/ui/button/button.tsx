import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:bg-brand hover:text-brand-foreground",
        secondary: "border border-border bg-card text-foreground hover:bg-elevated",
        ghost: "text-foreground hover:bg-surface",
      },
      size: {
        sm: "min-h-9 px-4",
        md: "min-h-11 px-5",
        lg: "min-h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";

  return (
    <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
});
