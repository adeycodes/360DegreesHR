"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/shared/components/brand-logo";
import { routes } from "@/config/routes";

/** Figma splash — white full screen, centered logo, then → SSO login */
export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(routes.auth.login);
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-white">
      <BrandLogo context="splash" />
    </div>
  );
}
