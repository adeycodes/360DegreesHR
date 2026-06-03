import { headings, type HeadingLevel } from "@/config/design-system/typography";
import { cn } from "@/lib/utils";

const levelToTag: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> =
  {
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
