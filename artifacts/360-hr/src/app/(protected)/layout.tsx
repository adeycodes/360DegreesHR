"use client";

import { useEffect } from "react";

import { AnimatedSplashScreen } from "@/modules/splash/screens/animated-splash-screen";
import { DashboardShell } from "@/shared/components/dashboard-shell";
import { useAuthStore } from "@/stores/auth-store";

export default function AppRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): import("react/jsx-runtime").JSX.Element {
  const { showSplash, setShowSplash } = useAuthStore();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div>
      {showSplash && (
        <AnimatedSplashScreen onComplete={handleSplashComplete} />
      )}
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
  