import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

type GlassBrandCardProps = {
  title: string;
  description?: string;
  footerLabel?: string;
  className?: string;
};

export function GlassBrandCard({
  title,
  description,
  footerLabel = "360DEGREESHR",
  className,
}: GlassBrandCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[400px] rounded-2xl border border-white/40 bg-white/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-[12px]",
        className,
      )}
    >
      <BrandLogo className="[&_svg]:h-9" />
      <h2 className="mt-6 text-[22px] leading-snug font-semibold tracking-tight text-grey-900">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[15px] leading-relaxed text-grey-500">{description}</p>
      ) : null}
      {footerLabel ? (
        <p className="mt-8 text-[10px] font-medium tracking-[0.22em] text-grey-400 uppercase">
          {footerLabel}
        </p>
      ) : null}
    </div>
  );
}
