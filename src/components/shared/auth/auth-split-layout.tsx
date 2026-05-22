import Image from "next/image";

import { AuthFooter } from "@/components/shared/auth/auth-footer";
import { cn } from "@/lib/utils";

export type AuthHeroVariant =
  | "sso-office"
  | "login-building"
  | "forgot-building"
  | "forgot-success-blue";

const heroImages: Record<AuthHeroVariant, string> = {
  "sso-office": "/images/figma/auth/sso-hero.png",
  "login-building": "/images/figma/auth/login-hero.png",
  "forgot-building": "/images/figma/auth/forgot-hero.png",
  "forgot-success-blue": "/images/figma/auth/forgot-success-hero.png",
};

type AuthSplitLayoutProps = {
  children: React.ReactNode;
  hero: React.ReactNode;
  variant: AuthHeroVariant;
  rightClassName?: string;
};

export function AuthSplitLayout({
  children,
  hero,
  variant,
  rightClassName,
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
                ? "bg-[#274376]/88"
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
      <AuthFooter />
    </div>
  );
}
