"use client";

import { useEffect } from "react";

import { AnimatedSplashScreen } from "@/components/features/splash/animated-splash-screen";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { useAuthStore } from "@/stores/auth-store";

export default function AppRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { showSplash, setShowSplash } = useAuthStore();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && (
        <AnimatedSplashScreen onComplete={handleSplashComplete} />
      )}
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
