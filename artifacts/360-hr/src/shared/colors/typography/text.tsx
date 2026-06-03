import { textStyles, type TextStyle } from "@/config/design-system/typography";
import { cn } from "@/lib/utils";

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
