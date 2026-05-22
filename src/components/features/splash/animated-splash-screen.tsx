"use client";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/shared/brand-logo";

interface AnimatedSplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

/**
 * Animated splash screen that shows after login before dashboard.
 * Features fade-in and scale animation for the logo.
 */
export function AnimatedSplashScreen({
  onComplete,
  duration = 2500,
}: AnimatedSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-fade-out {
          animation: fadeOut 0.5s ease-in forwards;
          animation-delay: 1.8s;
        }
      `}</style>

      <div className={`animate-scale-in ${!isVisible && "animate-fade-out"}`}>
        <BrandLogo size="splash" />
      </div>
    </div>
  );
}
