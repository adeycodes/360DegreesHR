import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utilities";

// ============================================================================
// TYPES
// ============================================================================

export type AuthHeroVariant =
  | "sso-office"
  | "login-building"
  | "forgot-building"
  | "forgot-success-blue";

type AuthFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  labelAction?: React.ReactNode;
  children: React.ReactNode;
};

type GlassBrandCardProps = {
  title: string;
  description?: string;
  footerLabel?: string;
  className?: string;
};

type LoginBuildingHeroProps = {
  title: string;
  description?: string;
};

type AuthSplitLayoutProps = {
  children: React.ReactNode;
  hero: React.ReactNode;
  variant: AuthHeroVariant;
  rightClassName?: string;
  hideFooter?: boolean;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const heroImages: Record<AuthHeroVariant, string> = {
  "sso-office": "/images/sso_hero_image.png",
  "login-building": "/images/login_hero_image.png",
  "forgot-building": "/images/figma/auth/forgot-hero.png",
  "forgot-success-blue": "/images/figma/auth/forgot-success-hero.png",
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * AuthField - Wrapper for form fields with label, error handling, and optional action
 */
export function AuthField({
  label,
  htmlFor,
  error,
  labelAction,
  children,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold tracking-[0.06em] text-grey-600 uppercase"
        >
          {label}
        </label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p className="text-body-3 text-error-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Utility function for auth input styling
 */
export function authInputClassName(className?: string) {
  return cn(
    "h-[48px] w-full rounded-lg border border-transparent bg-grey-100 px-4 text-[15px] text-grey-900 outline-none transition-[box-shadow,border-color,background] placeholder:text-grey-500 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-400/25",
    className,
  );
}

/**
 * AuthFooter - Standard footer for auth pages with links and copyright
 */
export function AuthFooter() {
  return (
    <footer className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-grey-200 bg-white px-6 py-4 text-[13px] text-grey-600 sm:flex-row sm:px-10 lg:px-16">
      <span className="font-brand text-sm font-semibold text-grey-800">
        <span className="text-grey-700">360</span>
        <span className="text-grey-700">Degrees</span>
        <span className="text-primary-600">HR</span>
      </span>
      <nav className="flex flex-wrap items-center justify-center gap-6">
        <Link href="#" className="hover:text-grey-900">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-grey-900">
          Terms of Service
        </Link>
        <Link href="#" className="hover:text-grey-900">
          Help Center
        </Link>
      </nav>
      <p className="text-grey-500">© 2024 360DegreesHR. All rights reserved.</p>
    </footer>
  );
}

/**
 * GlassBrandCard - Glassmorphic card with brand logo for auth panels
 */
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

/**
 * LoginBuildingHero - Shared left-panel hero for password login, register, forgot password
 */
export function LoginBuildingHero({ title, description }: LoginBuildingHeroProps) {
  return (
    <div className="flex h-full items-center justify-center py-10">
      <GlassBrandCard title={title} description={description} />
    </div>
  );
}

/**
 * AuthSplitLayout - Split layout for auth pages with image panel and content panel
 */
export function AuthSplitLayout({
  children,
  hero,
  variant,
  rightClassName,
  hideFooter,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white">
      <div className="flex min-h-0 flex-1 flex-col lg:min-h-[calc(100dvh-57px)] lg:flex-row">
        <aside className="relative hidden w-full overflow-hidden lg:block lg:w-1/2">
          <Image
            src={heroImages[variant]}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div
            className={cn(
              "absolute inset-0",
              variant === "forgot-success-blue"
                ? "bg-primary-500/88"
                : variant === "sso-office"
                  ? "bg-white/30"
                  : "bg-black/15",
            )}
          />
          <div className="relative z-10 flex h-full flex-col p-10 xl:p-12">
            {hero}
          </div>
        </aside>

        <main
          className={cn(
            "flex w-full flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-20",
            rightClassName,
          )}
        >
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </main>
      </div>
      {!hideFooter && <AuthFooter />}
    </div>
  );
}
