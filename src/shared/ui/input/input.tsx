import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground outline-none transition duration-150 placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-danger focus:border-danger focus:ring-danger/20",
        className,
      )}
      aria-invalid={hasError || undefined}
      {...props}
    />
  );
});
