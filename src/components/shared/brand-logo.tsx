import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoContext = "default" | "splash" | "signin" | "forgot-password" | "sso";

type BrandLogoProps = {
  className?: string;
  href?: string;
  variant?: "default" | "light";
  context?: LogoContext;
};

const logoConfig: Record<LogoContext, { width: number; height: number; className: string }> = {
  splash:           { width: 240, height: 80,  className: "w-[240px] h-auto" },
  signin:           { width: 160, height: 53,  className: "w-[160px] h-auto" },
  "forgot-password":{ width: 140, height: 46,  className: "w-[140px] h-auto" },
  sso:              { width: 140, height: 46,  className: "w-[140px] h-auto" },
  default:          { width: 120, height: 40,  className: "w-[120px] h-auto" },
};

export function BrandLogo({
  className,
  href,
  variant = "default",
  context = "default",
}: BrandLogoProps) {
  const { width, height, className: sizeClass } = logoConfig[context];

  const src = variant === "light"
    ? "/images/brand_logo_light.png"   // white version for dark/image backgrounds
    : "/images/brand_logo.png";        // default dark version

  const content = (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={src}
        alt="360DegreesHR"
        width={width}
        height={height}
        className={cn(sizeClass, "object-contain")}
        priority
      />
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}