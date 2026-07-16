import { cn } from "@/shared/lib";

type FeedbackMessageProps = {
  error?: string | null;
  message?: string | null;
  className?: string;
};

export function FeedbackMessage({ error, message, className }: FeedbackMessageProps) {
  const content = error ?? message;
  if (!content) return null;

  return (
    <p
      className={cn(
        "rounded-xl border p-3 text-sm",
        error
          ? "border-danger/40 bg-danger/10 text-danger"
          : "border-success/40 bg-success/10 text-success",
        className,
      )}
      role={error ? "alert" : "status"}
    >
      {content}
    </p>
  );
}
