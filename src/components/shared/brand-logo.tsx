import Link from "next/link";

import { cn } from "@/lib/utils";

const ARC_DOTS = [
  "#1A9B8A",
  "#1A9B8A",
  "#22B8A8",
  "#2EC4D4",
  "#3B82F6",
  "#4F46E5",
  "#7C3AED",
  "#A78BFA",
  "#F7A316",
  "#FE984A",
  "#E85D24",
] as const;

/** Splash screen arc positions (Figma) */
const SPLASH_DOTS = [
  { cx: 8, cy: 52 },
  { cx: 18, cy: 38 },
  { cx: 30, cy: 26 },
  { cx: 44, cy: 16 },
  { cx: 60, cy: 10 },
  { cx: 78, cy: 8 },
  { cx: 96, cy: 10 },
  { cx: 112, cy: 16 },
  { cx: 126, cy: 26 },
  { cx: 138, cy: 38 },
  { cx: 148, cy: 52 },
] as const;

type BrandLogoProps = {
  className?: string;
  href?: string;
  variant?: "default" | "light";
  /** `splash` = full-screen centered logo; `default` = sidebar/header */
  size?: "default" | "splash";
  showArc?: boolean;
};

function CompactLogoSvg({ light }: { light?: boolean }) {
  const degreesFill = light ? "#FFFFFF" : "#333F48";
  const hrFill = light ? "#B8E0DC" : "#2D5B63";

  return (
    <svg viewBox="0 0 200 32" className="h-8 w-[200px]" aria-hidden>
      {ARC_DOTS.map((fill, i) => (
        <circle
          key={i}
          cx={8 + i * 7}
          cy={6 - Math.sin((i / 10) * Math.PI) * 5}
          r="2.5"
          fill={fill}
        />
      ))}
      <text
        x="0"
        y="28"
        fontFamily="var(--font-manrope), sans-serif"
        fontSize="18"
        fontWeight="600"
      >
        <tspan fill={degreesFill}>360</tspan>
        <tspan fill={degreesFill}>Degrees</tspan>
        <tspan fill={hrFill}>HR</tspan>
      </text>
    </svg>
  );
}

function SplashLogoSvg() {
  return (
    <svg
      viewBox="0 0 320 72"
      className="h-[72px] w-[320px] max-w-[90vw]"
      aria-label="360DegreesHR"
      role="img"
    >
      {SPLASH_DOTS.map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r="5.5" fill={ARC_DOTS[i]} />
      ))}
      <text
        x="156"
        y="58"
        fontFamily="var(--font-manrope), system-ui, sans-serif"
        fontSize="28"
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        <tspan fill="#333F48">360Degrees</tspan>
        <tspan fill="#2D5B63">HR</tspan>
      </text>
    </svg>
  );
}

export function BrandLogo({
  className,
  href,
  variant = "default",
  size = "default",
  showArc = true,
}: BrandLogoProps) {
  const content = (
    <span className={cn("inline-flex items-center", className)}>
      {showArc ? (
        size === "splash" ? (
          <SplashLogoSvg />
        ) : (
          <CompactLogoSvg light={variant === "light"} />
        )
      ) : null}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
