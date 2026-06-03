import Image from "next/image";

import { AuthFooter } from "@/shared/auth/auth-footer";
import { cn } from "@/lib/utils";

export type AuthHeroVariant =
  | "sso-office"
  | "login-building"
  | "forgot-building"
  | "forgot-success-blue"
  | "otp-dark"
  | "lockout-blue";

const heroImages: Record<AuthHeroVariant, string> = {
  "sso-office": "/images/sso_hero_image.png",
  "login-building": "/images/login_hero_image.png",
  "forgot-building": "/images/login_hero_image.png",
  "forgot-success-blue": "/images/login_hero_image.png",
  "otp-dark": "/images/login_hero_image.png",
  "lockout-blue": "/images/sso_hero_image.png",
};

type AuthSplitLayoutProps = {
  children: React.ReactNode;
  hero: React.ReactNode;
  variant: AuthHeroVariant;
  rightClassName?: string;
  hideFooter?: boolean;
};

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
              variant === "forgot-success-blue" || variant === "lockout-blue"
                ? "bg-primary-600/90"
                : variant === "sso-office"
                  ? "bg-white/30"
                  : variant === "otp-dark"
                    ? "bg-black/60"
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
