import { cn } from "@/lib/utils";
import { headings, type HeadingLevel, textStyles, type TextStyle } from "@/config/design-system/typography";

// ──────────────────────────────────────────────────────────────
// Heading Component
// ──────────────────────────────────────────────────────────────

const levelToTag: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

const levelToUtility: Record<HeadingLevel, string> = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
};

type HeadingProps = {
  level: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export function Heading({ level, children, className, as }: HeadingProps) {
  const Tag = as ?? levelToTag[level];
  const spec = headings[level];

  return (
    <Tag
      className={cn(
        levelToUtility[level],
        "text-foreground",
        "textTransform" in spec && spec.textTransform === "uppercase" && "uppercase",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

// ──────────────────────────────────────────────────────────────
// Text Component
// ──────────────────────────────────────────────────────────────

const styleToUtility: Record<TextStyle, string> = {
  text1: "text-body-1",
  text2: "text-body-2",
  text3: "text-body-3",
};

type TextProps = {
  variant: TextStyle;
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
};

export function Text({
  variant,
  children,
  className,
  as: Tag = "p",
}: TextProps) {
  return (
    <Tag
      className={cn(styleToUtility[variant], "text-foreground", className)}
      data-text-style={textStyles[variant].label}
    >
      {children}
    </Tag>
  );
}

// ──────────────────────────────────────────────────────────────
// Quote Component
// ──────────────────────────────────────────────────────────────

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
