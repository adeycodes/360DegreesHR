import { cn } from "@/lib/utils";

type QuoteProps = {
  children: React.ReactNode;
  cite?: string;
  className?: string;
};

export function Quote({ children, cite, className }: QuoteProps) {
  return (
    <figure className={cn("space-y-2", className)}>
      <blockquote className="text-quote text-foreground">{children}</blockquote>
      {cite ? (
        <figcaption className="text-body-2 text-muted-foreground">
          — {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
